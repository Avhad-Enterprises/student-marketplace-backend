import DB from "@/database";

export class CountryService {
  public async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    region?: string,
    status?: string,
    sort: string = "name",
    order: string = "asc"
  ) {
    const offset = (page - 1) * limit;

    const baseQuery = DB("countries");

    if (search) {
      const like = `%${search}%`;
      baseQuery.where(function () {
        this.where("name", "ILIKE", like)
          .orWhere("code", "ILIKE", like)
          .orWhere("region", "ILIKE", like)
          .orWhere("visa_difficulty", "ILIKE", like)
          .orWhere("cost_of_living", "ILIKE", like)
          .orWhere("status", "ILIKE", like);
      });
    }

    if (region) baseQuery.where("region", region);
    if (status) baseQuery.where("status", status);

    const totalObj = await baseQuery.clone().count("id as count").first();
    const total = parseInt((totalObj && (totalObj as any).count) || "0");

    const validSortFields = ["name", "code", "region", "status", "popularity", "created_at", "updated_at", "cost_of_living", "visa_difficulty"];
    const finalSort = validSortFields.includes(sort) ? sort : "name";
    const finalOrder = order.toLowerCase() === "desc" ? "desc" : "asc";

    const semanticOrderFields = ["cost_of_living", "visa_difficulty"];

    let dataQuery = baseQuery.clone().select("*");

    if (semanticOrderFields.includes(finalSort)) {
      // Sort Low < Medium < High semantically via CASE expression
      const rawExpr = `CASE ${finalSort} WHEN 'Low' THEN 1 WHEN 'Medium' THEN 2 WHEN 'High' THEN 3 ELSE 4 END ${finalOrder.toUpperCase()}`;
      dataQuery = dataQuery.orderByRaw(rawExpr);
    } else {
      dataQuery = dataQuery.orderBy(finalSort, finalOrder as "asc" | "desc");
    }

    const countries = await dataQuery.limit(limit).offset(offset);

    for (let country of countries) {
      const univCount = await DB("universities").where("country_id", country.id).count("id as count").first();
      country.universities_count = parseInt(((univCount as any) || {}).count || "0");
    }

    return {
      data: countries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async getMetrics() {
    const total = await DB("countries").count("* as count").first();
    const active = await DB("countries").whereILike("status", "active").count("* as count").first();
    const visaFriendly = await DB("countries").whereILike("visa_difficulty", "Low").count("* as count").first();
    const highDemand = await DB("countries").where("popularity", ">", 0).count("* as count").first();
    const withUniversities = await DB("universities").countDistinct("country_id as count").first();

    return {
      totalCountries: parseInt(((total as any) || {}).count || "0"),
      activeCountries: parseInt(((active as any) || {}).count || "0"),
      visaFriendly: parseInt(((visaFriendly as any) || {}).count || "0"),
      highDemand: parseInt(((highDemand as any) || {}).count || "0"),
      withUniversities: parseInt(((withUniversities as any) || {}).count || "0"),
    };
  }

  public async findById(id: string | number) {
    const row = await DB("countries").where("id", id).first();
    return row || null;
  }

  public async create(countryData: any) {
    const insertObj = {
      name: countryData.name,
      code: countryData.code,
      region: countryData.region,
      visa_difficulty: countryData.visa_difficulty,
      cost_of_living: countryData.cost_of_living,
      work_rights: countryData.work_rights || false,
      pr_availability: countryData.pr_availability || false,
      status: countryData.status || "active",
      popularity: countryData.popularity || 0,
      service_visa: countryData.service_visa ?? false,
      service_insurance: countryData.service_insurance ?? false,
      service_housing: countryData.service_housing ?? false,
      service_loans: countryData.service_loans ?? false,
      service_forex: countryData.service_forex ?? false,
      service_courses: countryData.service_courses ?? false,
      service_food: countryData.service_food ?? false,
    };

    const res = await DB("countries").insert(insertObj).returning("id");
    return res && res[0] ? res[0] : null;
  }

  public async update(id: string | number, countryData: any) {
    const rawObj: Record<string, any> = {
      name: countryData.name,
      code: countryData.code,
      region: countryData.region,
      visa_difficulty: countryData.visa_difficulty,
      cost_of_living: countryData.cost_of_living,
      work_rights: countryData.work_rights,
      pr_availability: countryData.pr_availability,
      status: countryData.status,
      popularity: countryData.popularity,
      service_visa: countryData.service_visa,
      service_insurance: countryData.service_insurance,
      service_housing: countryData.service_housing,
      service_loans: countryData.service_loans,
      service_forex: countryData.service_forex,
      service_courses: countryData.service_courses,
      service_food: countryData.service_food,
      updated_at: DB.fn.now(),
    };

    // Strip undefined values so columns that may not exist yet don't cause DB errors
    const updateObj = Object.fromEntries(
      Object.entries(rawObj).filter(([, v]) => v !== undefined)
    );

    const res = await DB("countries").where("id", id).update(updateObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async delete(id: string | number) {
    const res = await DB("countries").where("id", id).del().returning("*");
    return !!(res && res.length > 0);
  }

  public async importCountries(countries: any[]) {
    for (const country of countries) {
      const insertObj = {
        name: country.name,
        code: country.code,
        region: country.region,
        visa_difficulty: country.visa_difficulty,
        cost_of_living: country.cost_of_living,
        work_rights: country.work_rights || false,
        pr_availability: country.pr_availability || false,
        status: country.status || "active",
        popularity: country.popularity || 0,
      };
      await DB("countries").insert(insertObj).onConflict("name").merge({
        code: insertObj.code,
        region: insertObj.region,
        status: insertObj.status,
      });
    }

    return countries.length;
  }

  public async exportCountries(ids?: (string | number)[]) {
    const query = DB("countries").select("*");
    if (ids && ids.length > 0) {
      query.whereIn("id", ids);
    }
    return await query;
  }

  public async bulkUpdate(ids: (string | number)[], status: string) {
    const res = await DB("countries").whereIn("id", ids).update({ status, updated_at: DB.fn.now() }).returning("*");
    return res;
  }
}
