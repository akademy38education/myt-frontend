import { mockLibraryResources, type LibraryResourceMock } from "@/mocks";
import { delay } from "@/utils/delay";

export interface LibraryFilter {
  query?: string;
  subjectId?: string;
  yearGroup?: string;
  type?: LibraryResourceMock["type"];
  difficulty?: LibraryResourceMock["difficulty"];
}

/** Learning-library resources are mock data — see backend's scaffolded `learning-library` module for the real-content plan. */
export const libraryService = {
  async search(filter: LibraryFilter): Promise<LibraryResourceMock[]> {
    await delay(200);
    return mockLibraryResources.filter((resource) => {
      if (filter.subjectId && resource.subjectId !== filter.subjectId) return false;
      if (filter.yearGroup && resource.yearGroup !== filter.yearGroup) return false;
      if (filter.type && resource.type !== filter.type) return false;
      if (filter.difficulty && resource.difficulty !== filter.difficulty) return false;
      if (filter.query) {
        const q = filter.query.toLowerCase();
        if (!resource.title.toLowerCase().includes(q) && !resource.topic.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  },

  async getById(id: string): Promise<LibraryResourceMock | undefined> {
    await delay(150);
    return mockLibraryResources.find((r) => r.id === id);
  },

  async getRelated(resource: LibraryResourceMock): Promise<LibraryResourceMock[]> {
    await delay(150);
    return mockLibraryResources.filter((r) => r.id !== resource.id && (r.topic === resource.topic || r.subjectId === resource.subjectId)).slice(0, 3);
  },
};
