import { Knex } from "knex";

interface Filter {
    field: string;
    operator: string;
    value: any;
}

interface FilterGroup {
    logic: "AND" | "OR";
    conditions: (Filter | FilterGroup)[];
}

interface Sort {
    field: string;
    order: "asc" | "desc";
}

interface Join {
    table: string;
    on: string;
    type?: "inner" | "left";
}

interface ReportQueryConfig {
    table: string;
    metrics?: string[];
    dimensions?: string[];
    filters?: (Filter | FilterGroup)[];
    groupBy?: string[];
    sort?: Sort[];
    joins?: Join[];
}

const applyFilter = (query: any, field: string, operator: string, value: any, method: string) => {
    const op = operator.toLowerCase();
    
    switch (op) {
        case 'equals':
            return query[method](field, '=', value);
        case 'not_equals':
            return query[method](field, '!=', value);
        case 'gt':
        case 'greater_than':
            return query[method](field, '>', value);
        case 'lt':
        case 'less_than':
            return query[method](field, '<', value);
        case 'contains':
            return query[method](field, 'ilike', `%${value}%`);
        case 'in':
            return query[method + 'In'](field, Array.isArray(value) ? value : [value]);
        case 'between':
            return query[method + 'Between'](field, value);
        default:
            // Fallback for standard SQL operators if passed directly
            return query[method](field, operator, value);
    }
};

const buildFilters = (query: any, filters: (Filter | FilterGroup)[], parentLogic: "AND" | "OR" = "AND") => {
    filters.forEach((f) => {
        const isGroup = (f as any).conditions !== undefined;
        
        if (isGroup) {
            const group = f as FilterGroup;
            const method = parentLogic === "OR" ? "orWhere" : "where";
            
            query[method](function(this: any) {
                buildFilters(this, group.conditions, group.logic);
            });
        } else {
            const filter = f as Filter;
            const method = parentLogic === "OR" ? "orWhere" : "where";
            applyFilter(query, filter.field, filter.operator, filter.value, method);
        }
    });
};

export const buildQuery = (db: Knex, config: ReportQueryConfig) => {
    const {
        table,
        metrics = [],
        dimensions = [],
        filters = [],
        groupBy = [],
        sort = [],
        joins = [],
    } = config;

    let query = db(table);

    joins.forEach((join) => {
        const method = join.type === "left" ? "leftJoin" : "join";
        const [left, right] = join.on.split("=");
        query = query[method](
            join.table,
            left.trim(),
            "=",
            right.trim()
        );
    });

    const selectFields: any[] = [];
    const groupByFields: any[] = [];

    dimensions.forEach((dim) => {
        // Use a string for standard columns, Knex will handle quoting
        selectFields.push(dim);
        groupByFields.push(dim);
    });

    metrics.forEach((metric) => {
        // Metrics are expected to be raw SQL strings like 'SUM("col")'
        selectFields.push(db.raw(metric));
    });

    if (selectFields.length > 0) {
        query.select(selectFields);
    }

    if (filters.length > 0) {
        // Filter out any invalid filters that might have reached the backend
        const validFilters = filters.filter(f => {
            if ((f as any).conditions) return (f as any).conditions.length > 0;
            return (f as any).field && (f as any).operator;
        });

        if (validFilters.length > 0) {
            query.where(function(this: any) {
                buildFilters(this, validFilters, "AND");
            });
        }
    }

    if (groupByFields.length > 0 && metrics.length > 0) {
        query.groupBy(groupByFields);
    }

    sort.forEach((s) => {
        query.orderBy(s.field, s.order);
    });

    return query;
};