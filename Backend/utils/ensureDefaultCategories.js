const { Category } = require("../model/category");
const { DEFAULT_PROPERTY_CATEGORIES } = require("../data/defaultCategories");

exports.ensureDefaultCategories = async function ensureDefaultCategories() {
  const existingCategories = await Category.find(
    {},
    {
      category: 1,
    }
  );

  const existingNames = new Set(
    existingCategories.map((item) => item.category.trim().toLowerCase())
  );

  const missingCategories = DEFAULT_PROPERTY_CATEGORIES.filter(
    (category) => !existingNames.has(category.toLowerCase())
  ).map((category) => ({ category }));

  if (missingCategories.length > 0) {
    await Category.insertMany(missingCategories, { ordered: false });
  }
};
