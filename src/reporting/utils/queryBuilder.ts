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

const ALLOWED_TABLES = [
    "students",
    "payments",
    "bookings",
    "sops",
    "universities",
    "countries",
    "experts",
    "applications",
    "courses",
];

const ALLOWED_COLUMNS: { [key: string]: string[] } = {
    students: ["id", "student_id", "email", "first_name", "last_name", "created_at"],
    payments: ["id", "payment_id", "amount", "currency", "status", "created_at", "student_db_id"],
    bookings: ["id", "booking_id", "service", "status", "date_time", "expert"],
    sops: ["id", "student_id", "university", "country", "status", "review_status"],
    universities: ["id", "name", "univ_id", "status"],
    countries: ["id", "name", "code", "status"],
    experts: ["id", "expert_id", "full_name", "status"],
};

const validateTable = (table: string): string => {
    if (!ALLOWED_TABLES.includes(table)) {
        throw new Error(`Forbidden: Access to table '${table}' is not permitted.`);
    }
    return table;
};

const validateColumn = (column: string, table: string): string => {
    // Basic column name validation (sanitize dots for joins)
    const [t, col] = column.includes(".") ? column.split(".") : [table, column];
    const targetTable = t || table;
    
    if (!ALLOWED_TABLES.includes(targetTable)) {
        throw new Error(`Forbidden: Access to table '${targetTable}' is not permitted.`);
    }
    
    if (ALLOWED_COLUMNS[targetTable] && !ALLOWED_COLUMNS[targetTable].includes(col)) {
        throw new Error(`Forbidden: Access to column '${col}' in table '${targetTable}' is not permitted.`);
    }

    return `${targetTable}.${col}`;
};

const applyFilter = (query: any, field: string, operator: string, value: any, method: string, table: string) => {
    const op = operator.toLowerCase();
    const validatedField = validateColumn(field, table);
    
    switch (op) {
        case 'equals':
            return query[method](validatedField, '=', value);
        case 'not_equals':
            return query[method](validatedField, '!=', value);
        case 'gt':
        case 'greater_than':
            return query[method](validatedField, '>', value);
        case 'lt':
        case 'less_than':
            return query[method](validatedField, '<', value);
        case 'contains':
            return query[method](validatedField, 'ilike', `%${value}%`);
        case 'in':
            return query[method + 'In'](validatedField, Array.isArray(value) ? value : [value]);
        case 'between':
            return query[method + 'Between'](validatedField, value);
        default:
            // For security, only allow specific standard operators if not in the map
            const safeOps = ['=', '!=', '>', '<', '>=', '<='];
            if (safeOps.includes(operator)) {
                return query[method](validatedField, operator, value);
            }
            throw new Error(`Forbidden: Operator '${operator}' is not permitted.`);
    }
};

const buildFilters = (query: any, filters: (Filter | FilterGroup)[], table: string, parentLogic: "AND" | "OR" = "AND") => {
    filters.forEach((f) => {
        const isGroup = (f as any).conditions !== undefined;
        
        if (isGroup) {
            const group = f as FilterGroup;
            const method = parentLogic === "OR" ? "orWhere" : "where";
            
            query[method](function(this: any) {
                buildFilters(this, group.conditions, table, group.logic);
            });
        } else {
            const filter = f as Filter;
            const method = parentLogic === "OR" ? "orWhere" : "where";
            applyFilter(query, filter.field, filter.operator, filter.value, method, table);
        }
    });
};

export const buildQuery = (db: Knex, config: ReportQueryConfig, eventId?: number) => {
    const {
        table,
        metrics = [],
        dimensions = [],
        filters = [],
        groupBy = [],
        sort = [],
        joins = [],
    } = config;

    const validatedBaseTable = validateTable(table);
    let query = db(validatedBaseTable);

    if (eventId) {
        // Only apply if the table has event_id or university_id
        // For simplicity, we assume tables in this context should be filtered if they are tenant-specific
        if (['bookings', 'enquiries', 'communication_templates', 'event_campaigns', 'audience_segments'].includes(validatedBaseTable)) {
            query = query.where(`${validatedBaseTable}.event_id`, eventId);
        } else if (validatedBaseTable === 'courses' || validatedBaseTable === 'universities') {
            const col = validatedBaseTable === 'universities' ? 'id' : 'university_id';
            query = query.where(`${validatedBaseTable}.${col}`, eventId);
        }
    }

    joins.forEach((join) => {
        const method = join.type === "left" ? "leftJoin" : "join";
        const validatedJoinTable = validateTable(join.table);
        const [left, right] = join.on.split("=");
        
        query = query[method](
            validatedJoinTable,
            validateColumn(left.trim(), validatedBaseTable),
            "=",
            validateColumn(right.trim(), validatedJoinTable)
        );
    });

    const selectFields: any[] = [];
    const groupByFields: any[] = [];

    dimensions.forEach((dim) => {
        const validatedDim = validateColumn(dim, validatedBaseTable);
        selectFields.push(validatedDim);
        groupByFields.push(validatedDim);
    });

    metrics.forEach((metric) => {
        const allowedFunctions = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'];
        const metricRegex = /^(\w+)\(([^)]+)\)(?:\s+AS\s+([^ ]+))?$/i;
        const match = metric.trim().match(metricRegex);
        
        if (match) {
            const [, func, column, alias] = match;
            if (allowedFunctions.includes(func.toUpperCase())) {
                const col = column.trim() === '*' ? '*' : validateColumn(column.trim(), validatedBaseTable);
                const sanitizedAlias = alias ? alias.trim().replace(/[^a-zA-Z0-9_]/g, '') : '';
                
                // Use parameterized or template structure for the aggregate function
                // Still uses db.raw but components are strictly whitelisted/validated
                const selectClause = alias 
                    ? db.raw(`${func.toUpperCase()}(??) AS ??`, [col, sanitizedAlias])
                    : db.raw(`${func.toUpperCase()}(??)`, [col]);
                
                selectFields.push(selectClause);
                return;
            }
        }
        
        throw new Error(`Forbidden: Metric expression '${metric}' is not permitted.`);
    });

    if (selectFields.length > 0) {
        query.select(selectFields);
    }

    if (filters.length > 0) {
        query.where(function(this: any) {
            buildFilters(this, filters, validatedBaseTable, "AND");
        });
    }

    if (groupByFields.length > 0 && metrics.length > 0) {
        query.groupBy(groupByFields);
    }

    sort.forEach((s) => {
        query.orderBy(validateColumn(s.field, validatedBaseTable), s.order);
    });

    return query;
};