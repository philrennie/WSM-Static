// Applies to every category page. Kept here (not in front matter) so the CMS can't break it.
export default {
  layout: "layouts/category.njk",
  permalink: (data) => `/${data.page.fileSlug}/`,
};
