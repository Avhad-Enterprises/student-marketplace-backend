import DB from "@/database";

export class UniversityService {
  public async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    country_id?: string,
    type?: string,
    status?: string,
    sort: string = "name",
    order: string = "asc",
    application_status?: string
  ) {
    const offset = (page - 1) * limit;

    const baseQuery = DB("universities as u").join("countries as c", "u.country_id", "c.id");

    if (search) {
      const like = `%${search}%`;
      baseQuery.where(function () {
        this.where("u.name", "ILIKE", like).orWhere("u.city", "ILIKE", like);
      });
    }

    if (country_id) baseQuery.where("u.country_id", country_id);
    if (type) baseQuery.where("u.type", type);
    if (status) baseQuery.where("u.status", status);
    if (application_status) baseQuery.where("u.application_status", application_status);

    const totalObj = await baseQuery.clone().count("u.id as count").first();
    const total = parseInt((totalObj && (totalObj as any).count) || "0");

    const validSortFields = ["name", "city", "type", "status", "ranking", "created_at", "tuition", "acceptance_rate"];
    const finalSort = validSortFields.includes(sort) ? `u.${sort}` : "u.name";
    const finalOrder = order.toLowerCase() === "desc" ? "desc" : "asc";

    const data = await baseQuery
      .clone()
      .select("u.*", "c.name as country_name")
      .orderBy(finalSort, finalOrder as "asc" | "desc")
      .limit(limit)
      .offset(offset);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async getMetrics() {
    const totalRes = await DB("universities").count("* as count").first();
    const activeRes = await DB("universities").where("status", "active").count("* as count").first();
    const acceptingRes = await DB("universities").where("application_status", "open").count("* as count").first();
    const openIntakesRes = await DB("universities").where("intakes", "ILIKE", "%Spring%").orWhere("intakes", "ILIKE", "%Fall%").count("* as count").first();
    const highOfferRes = await DB("universities").whereRaw("CAST(regexp_replace(acceptance_rate, '[^0-9]', '', 'g') AS INTEGER) > 70").count("* as count").first();

    return {
      totalUniversities: parseInt(((totalRes as any) || {}).count || "0"),
      activeUniversities: parseInt(((activeRes as any) || {}).count || "0"),
      acceptingApps: parseInt(((acceptingRes as any) || {}).count || "0"),
      openIntakes: parseInt(((openIntakesRes as any) || {}).count || "0"),
      highOfferRate: parseInt(((highOfferRes as any) || {}).count || "0"),
    };
  }

  public async findById(id: string | number) {
    const university = await DB("universities").where("id", id).first();
    return university || null;
  }

  public async create(universityData: any) {
    let countryId = universityData.country_id;

    if (!countryId && universityData.country) {
      const countryName = universityData.country;
      let country = await DB("countries").where("name", "ILIKE", countryName).first();

      if (!country) {
        // Provide defaults for potentially required fields
        const insertObj = {
          name: countryName,
          code: countryName.substring(0, 3).toUpperCase(),
          region: 'Unknown',
          visa_difficulty: 'Medium',
          cost_of_living: 'Medium',
          status: 'active'
        };
        try {
          const inserted = await DB("countries").insert(insertObj).returning("id");
          if (inserted && inserted[0]) {
            countryId = inserted[0].id ? inserted[0].id : inserted[0];
          }
        } catch (err) {
          // If insert fails (e.g. race condition), try finding it again
          country = await DB("countries").where("name", "ILIKE", countryName).first();
          if (country) countryId = country.id;
          else throw err; // Re-throw if genuinely failed
        }
      } else {
        countryId = country.id;
      }
    }

    const insertObj = {
      name: universityData.name,
      univ_id: universityData.univ_id,
      city: universityData.city,
      country_id: countryId || universityData.country_id,
      tuition: universityData.tuition,
      acceptance_rate: universityData.acceptanceRate || universityData.acceptance_rate,
      type: universityData.type,
      application_status: universityData.applicationStatus || universityData.application_status || "open",
      ranking: universityData.ranking || 0,
      intakes: universityData.intakes,
      status: universityData.status || "active",
    };

    const res = await DB("universities").insert(insertObj).returning("id");
    return res && res[0] ? { id: res[0] } : null;
  }

  public async update(id: string | number, universityData: any) {
    let countryId = universityData.country_id;

    // Handle string country name -> country_id mapping for convenience
    // This allows passing { country: "USA" } and automatically mapping it.
    if (!countryId && universityData.country) {
      const countryName = universityData.country;
      let country = await DB("countries").where("name", "ILIKE", countryName).first();

      if (!country) {
        // Create country if it doesn't exist (optional, depends on policy)
        // Or throw error. Since frontend allows free text, let's create it for now to avoid errors.
        const insertObj = {
          name: countryName,
          code: countryName.substring(0, 3).toUpperCase(),
          region: 'Unknown',
          visa_difficulty: 'Medium',
          cost_of_living: 'Medium',
          status: 'active'
        };
        try {
          const inserted = await DB("countries").insert(insertObj).returning("id");
          if (inserted && inserted[0]) {
            countryId = inserted[0].id ? inserted[0].id : inserted[0]; // handle Knex return variations
          }
        } catch (err) {
          // If insert fails, try finding again
          country = await DB("countries").where("name", "ILIKE", countryName).first();
          if (country) countryId = country.id;
          else throw err;
        }
      } else {
        countryId = country.id;
      }
    }

    const updateObj = {
      name: universityData.name,
      univ_id: universityData.univ_id,
      city: universityData.city,
      country_id: countryId || universityData.country_id, // prioritize resolved ID
      tuition: universityData.tuition,
      acceptance_rate: universityData.acceptanceRate || universityData.acceptance_rate, // Handle camelCase input
      type: universityData.type,
      application_status: universityData.applicationStatus || universityData.application_status, // Handle camelCase
      ranking: universityData.ranking,
      intakes: universityData.intakes,
      status: universityData.status,
      updated_at: DB.fn.now(),
    };

    // Remove undefined keys so they don't overwrite with null unless intended
    Object.keys(updateObj).forEach(key => (updateObj as any)[key] === undefined && delete (updateObj as any)[key]);


    const res = await DB("universities").where("id", id).update(updateObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async delete(id: string | number) {
    const res = await DB("universities").where("id", id).del().returning("*");
    return res && res.length > 0;
  }

  public async importUniversities(universities: any[]) {
    const rows = universities.map((univ) => ({
      name: univ.name,
      univ_id: univ.univ_id,
      city: univ.city,
      country_id: univ.country_id,
      tuition: univ.tuition,
      acceptance_rate: univ.acceptance_rate,
      type: univ.type,
      application_status: univ.application_status || "open",
      ranking: univ.ranking || 0,
      intakes: univ.intakes,
      status: univ.status || "active",
    }));

    if (rows.length === 0) return 0;
    await DB.batchInsert("universities", rows);
    return rows.length;
  }

  public async exportUniversities() {
    return await DB("universities").select("*");
  }
}
