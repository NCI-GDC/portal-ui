export const handleClickInchlibLink = (
  {
    detail: {
      case_id = '',
      ensembl_id = '',
    },
  },
) => {
  const nextPage = ensembl_id === ''
    ? `/cases/${case_id}`
    : `/genes/${ensembl_id}`;
  // This opens the link in a new tab
  Object.assign(document.createElement('a'), {
    href: nextPage,
    target: '_blank',
  }).click();
};
