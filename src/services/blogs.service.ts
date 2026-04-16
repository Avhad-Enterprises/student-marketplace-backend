import DB from "@/database";
import { Tables } from "@/database/tables";
import { sanitizeHTML } from "@/utils/sanitization";

export class BlogsService {
    public async findAll(isAdmin = false) {
        const query = DB(Tables.BLOGS).orderBy("created_at", "desc");
        if (!isAdmin) {
            query.where("status", "published")
                 .where("visibility", "public")
                 .where(function() {
                     this.whereNull("publish_date").orWhere("publish_date", "<=", DB.fn.now());
                 });
        }
        return await query;
    }

    public async findById(id: string | number, isAdmin = false) {
        const query = DB(Tables.BLOGS).where("id", id).first();
        if (!isAdmin) {
            query.where("status", "published")
                 .where("visibility", "public")
                 .where(function() {
                     this.whereNull("publish_date").orWhere("publish_date", "<=", DB.fn.now());
                 });
        }
        const row = await query;
        return row || null;
    }

    public async findByBlogId(blogId: string) {
        const row = await DB(Tables.BLOGS).where("blog_id", blogId).first();
        return row || null;
    }

    public async create(blogData: any) {
        // Generate blog_id if not provided
        if (!blogData.blog_id) {
            const count = await DB(Tables.BLOGS).count("id as count").first();
            const nextNum = (Number(count?.count || 0) + 1).toString().padStart(3, '0');
            blogData.blog_id = `BLOG-${nextNum}`;
        }

        const insertObj = {
            blog_id: blogData.blog_id,
            title: (blogData.title || "").replace(/<[^>]*>?/gm, ''), // Strip all HTML from title
            author: blogData.author,
            category: blogData.category,
            content: sanitizeHTML(blogData.content || ""),
            tags: typeof blogData.tags === 'string' ? blogData.tags : JSON.stringify(blogData.tags || []),
            status: blogData.status || 'draft',
            visibility: blogData.visibility || 'public',
            publish_date: blogData.publish_date || null,
            meta_title: blogData.meta_title || null,
            meta_description: blogData.meta_description || null,
        };

        const res = await DB(Tables.BLOGS).insert(insertObj).returning("*");
        return res && res[0] ? res[0] : null;
    }

    public async update(id: string | number, blogData: any) {
        const updateObj: any = {
            updated_at: DB.fn.now(),
        };

        if (blogData.title !== undefined) updateObj.title = (blogData.title || "").replace(/<[^>]*>?/gm, '');
        if (blogData.author !== undefined) updateObj.author = blogData.author;
        if (blogData.category !== undefined) updateObj.category = blogData.category;
        if (blogData.content !== undefined) updateObj.content = sanitizeHTML(blogData.content || "");
        if (blogData.tags !== undefined) {
            updateObj.tags = typeof blogData.tags === 'string' ? blogData.tags : JSON.stringify(blogData.tags);
        }
        if (blogData.status !== undefined) updateObj.status = blogData.status;
        if (blogData.visibility !== undefined) updateObj.visibility = blogData.visibility;
        if (blogData.publish_date !== undefined) updateObj.publish_date = blogData.publish_date;
        if (blogData.meta_title !== undefined) updateObj.meta_title = blogData.meta_title;
        if (blogData.meta_description !== undefined) updateObj.meta_description = blogData.meta_description;

        const res = await DB(Tables.BLOGS).where("id", id).update(updateObj).returning("*");
        return res && res[0] ? res[0] : null;
    }

    public async delete(id: string | number) {
        const res = await DB(Tables.BLOGS).where("id", id).del().returning("*");
        return !!(res && res.length > 0);
    }

    public async import(blogsData: any[]): Promise<{ success: number; failed: number; errors: string[] }> {
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        await DB.transaction(async (trx) => {
            for (const blog of blogsData) {
                try {
                    const blogId = blog.blogId || blog.blog_id;
                    
                    const payload: any = {
                        title: (blog.title || "").replace(/<[^>]*>?/gm, ''), // Strip all HTML from title
                        author: blog.author || 'Anonymous',
                        category: blog.category || 'Uncategorized',
                        content: sanitizeHTML(blog.content || ""),
                        tags: Array.isArray(blog.tags) ? JSON.stringify(blog.tags) : (typeof blog.tags === 'string' ? JSON.stringify(blog.tags.split(',').map((t: string) => t.trim())) : JSON.stringify([])),
                        status: (blog.status || 'draft').toLowerCase(),
                        visibility: (blog.visibility || 'public').toLowerCase(),
                        publish_date: blog.publish_date || blog.publishDate || null,
                        meta_title: blog.meta_title || blog.metaTitle || null,
                        meta_description: blog.meta_description || blog.metaDescription || null,
                        updated_at: new Date()
                    };

                    let existing = null;
                    if (blogId) {
                        existing = await trx(Tables.BLOGS).where({ blog_id: blogId }).first();
                    }

                    if (existing) {
                        await trx(Tables.BLOGS).where({ id: existing.id }).update(payload);
                    } else {
                        payload.blog_id = blogId || `BLOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                        payload.created_at = new Date();
                        await trx(Tables.BLOGS).insert(payload);
                    }
                    success++;
                } catch (error: any) {
                    failed++;
                    errors.push(`Row ${success + failed}: ${error.message}`);
                }
            }
        });

        return { success, failed, errors };
    }
}
