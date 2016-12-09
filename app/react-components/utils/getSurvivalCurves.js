export default function({api, value, field, slug, projectId}) {
  const filters = [
    {
      op: "and",
      content: [
        { op: "=", content: { field: "project.project_id", value: projectId } },
        { op: "=", content: { field, value } }
      ]
    },
    {
      op: "and",
      content: [
        { op: "=", content: { field: "project.project_id", value: projectId } },
        { op: "excludeifany", content: { field, value } },
      ]
    }
  ];

  const url = `${api}/analysis/survival?filters=${JSON.stringify(filters)}`

  return fetch(url)
    .then(r => r.json())
    .then((rawData) => ({
      rawData,
      id: value,
      legend: [
        `${slug || value} mutated cases`,
        `${slug || value} not mutated cases`
      ]
    }));
}
