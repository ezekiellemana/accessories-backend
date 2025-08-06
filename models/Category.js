const mongoose = require("mongoose");
const slugify = require("slugify"); // Optional but useful

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    image: {
      type: String, // Optional: image URL
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
