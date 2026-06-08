import { getDataset, getSources } from "@sangkan-dev/titimangsa";

export function listSources(year: number) {
  const dataset = getDataset(year);

  return {
    meta: {
      year: dataset.year,
      revision: dataset.revision,
      status: dataset.status,
      total: dataset.sources.length,
      updatedAt: dataset.updatedAt,
    },
    data: getSources(year),
  };
}
