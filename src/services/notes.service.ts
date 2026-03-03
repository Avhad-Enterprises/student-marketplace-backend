import DB from "@/database";

export class NoteService {
  
  public async findByStudentId(studentDbId: string | number) {
    return await DB("student_notes")
      .where("student_db_id", studentDbId)
      .orderBy("is_pinned", "desc")
      .orderBy("created_at", "desc");
  }

  public async findById(id: string | number) {
    const row = await DB("student_notes").where("id", id).first();
    return row || null;
  }

  public async create(noteData: any) {
    const insertObj = {
      student_db_id: noteData.student_db_id,
      note_type: noteData.note_type,
      title: noteData.title,
      content: noteData.content,
      created_by: noteData.created_by,
      is_pinned: noteData.is_pinned || false,
      tags: noteData.tags || [],
    };

    const res = await DB("student_notes").insert(insertObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async update(id: string | number, noteData: any) {
    const updateObj = {
      note_type: noteData.note_type,
      title: noteData.title,
      content: noteData.content,
      is_pinned: noteData.is_pinned,
      tags: noteData.tags,
      updated_at: DB.fn.now(),
    };

    const res = await DB("student_notes").where("id", id).update(updateObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async togglePin(id: string | number) {
    const note = await DB("student_notes").where("id", id).first();
    if (!note) return null;
    const res = await DB("student_notes")
      .where("id", id)
      .update({ is_pinned: !note.is_pinned, updated_at: DB.fn.now() })
      .returning("*");

    return res && res[0] ? res[0] : null;
  }

  public async delete(id: string | number) {
    const res = await DB("student_notes").where("id", id).del().returning("*");
    return !!(res && res.length > 0);
  }
}
