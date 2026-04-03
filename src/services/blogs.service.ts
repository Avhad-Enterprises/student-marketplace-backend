import DB from "@/database";
import { Tables } from "@/database/tables";

export class BlogsService {
    public async findAll() {
        return await DB(Tables.BLOGS).orderBy("created_at", "desc");
    }

    public async findById(id: string | number) {
        const row = await DB(Tables.BLOGS).where("id", id).first();
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
            title: blogData.title,
            author: blogData.author,
            category: blogData.category,
            content: blogData.content,
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

        if (blogData.title !== undefined) updateObj.title = blogData.title;
        if (blogData.author !== undefined) updateObj.author = blogData.author;
        if (blogData.category !== undefined) updateObj.category = blogData.category;
        if (blogData.content !== undefined) updateObj.content = blogData.content;
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
}
