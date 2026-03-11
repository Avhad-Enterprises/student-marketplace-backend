import DB from "@/database";
import { LibraryItem } from "@/interfaces/libraryItem.interface";

export class LibraryItemService {
    public async findAll(): Promise<LibraryItem[]> {
        return await DB("ai_test_library").orderBy("created_at", "desc");
    }

    public async findById(id: string | number): Promise<LibraryItem | null> {
        const row = await DB("ai_test_library").where("id", id).first();
        return row || null;
    }

    public async findByItemId(itemId: string): Promise<LibraryItem | null> {
        const row = await DB("ai_test_library").where("item_id", itemId).first();
        return row || null;
    }

    public async create(data: LibraryItem): Promise<LibraryItem> {
        const insertObj = {
            item_id: data.item_id,
            title: data.title,
            exam: data.exam,
            difficulty: data.difficulty,
            topic: data.topic,
            type: data.type,
            transcript: data.transcript,
            sections_included: data.sections_included ? JSON.stringify(data.sections_included) : null,
            duration: data.duration,
            status: data.status,
            usage_30d: data.usage_30d || 0,
        };

        const [res] = await DB("ai_test_library").insert(insertObj).returning("*");
        return res;
    }

    public async update(id: string | number, data: Partial<LibraryItem>): Promise<LibraryItem> {
        const updateObj: any = {
            ...data,
            updated_at: DB.fn.now(),
        };

        if (data.sections_included) {
            updateObj.sections_included = JSON.stringify(data.sections_included);
        }

        const [res] = await DB("ai_test_library").where("id", id).update(updateObj).returning("*");
        return res;
    }

    public async delete(id: string | number): Promise<boolean> {
        const res = await DB("ai_test_library").where("id", id).del();
        return res > 0;
    }
}
