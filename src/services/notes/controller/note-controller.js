import { nanoid } from "nanoid";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";
import response from "../../../utils/response.js";
import NoteRepositories from "../repositories/note-repositories.js";

const noteRepositories = new NoteRepositories();

export const createNote = async (req, res, next) => {
  const { title = "untitled", tags, body } = req.body;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const note = await noteRepositories.createNote({
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  });

  if (!note) {
    return next(new InvariantError("Catatan gagal ditambahkan"));
  }

  return response(res, 201, "Catatan berhasil ditambahkan", { noteId: id });
};

export const getNotes = async (req, res) => {
  const notes = await noteRepositories.getNotes();
  return response(res, 200, 'Catatan sukses ditampilkan', notes);
};

export const getNoteById = async (req, res, next) => {
  const { id } = req.params;
  const note = await noteRepositories.getNoteById(id);

  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }

  return response(res, 200, "Catatan berhasil ditemukan", { note });
};

export const editNoteById = async (req, res, next) => {
  const { id } = req.params;
  const { title, tags, body } = req.body;
  const updatedAt = new Date().toISOString();

  const note = await noteRepositories.getNoteById(id);

  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }

  const updatedNote = await noteRepositories.editNote({
    id,
    title,
    tags,
    body,
    updatedAt,
  });
  return response(res, 200, "Catatan berhasil diperbarui", updatedNote);
};

export const deleteNoteById = async (req, res, next) => {
  const { id } = req.params;
  const note = await noteRepositories.getNoteById(id);

  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }

  const deletedNoteId = await noteRepositories.deleteNote(id);
  return response(res, 200, "Catatan berhasil dihapus", { noteId: deletedNoteId });
};
