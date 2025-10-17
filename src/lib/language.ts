export const TEXTS = {
  language: { en: "English", si: "සිංහල" },
  actions: {
    view: { en: "View", si: "පෙන්වන්න" },
    create: { en: "Create", si: "සාදන්න" },
    edit: { en: "Edit", si: "යාවත්කාලීන කරන්න" },
    delete: { en: "Delete", si: "මකන්න" },
    cancel: { en: "Cancel", si: "අවලංගු කරන්න" }
  },
  categories: {
    title: { en: "Product Categories", si: "භාණ්ඩ වර්ග" },
    subtitle: {
      en: "Manage your product categories",
      si: "ඔබේ භාණ්ඩ වර්ග කළමනාකරණය කරන්න"
    },
    update: {
      title: { en: "Update Category", si: "කාණ්ඩය යාවත්කාලීන කරන්න" },
      description: {
        en: "Make changes to your category here.",
        si: "යාවත්කාලීන කිරීමට අදාල තොරතුරු පහත ෆෝරමයේ ඇතුලත් කරන්න."
      }
    },
    addNew: { en: "Add Category", si: "නව කාණ්ඩය එක් කරන්න" }
  },
  products: {
    title: { en: "Product Inventory", si: "භාණ්ඩ ගබඩාව" },
    subtitle: {
      en: "Manage your store Inventory here",
      si: "ඔබේ භාණ්ඩ ගබඩාව කළමනාකරණය කරන්න"
    },
    update: {
      title: { en: "Update Product", si: "භාණ්ඩය යාවත්කාලීන කරන්න" },
      description: {
        en: "Make changes to your product here.",
        si: "යාවත්කාලීන කිරීමට අදාල තොරතුරු පහත ෆෝරමයේ ඇතුලත් කරන්න."
      }
    },
    addNew: {
      title: { en: "Add Product", si: "නව භාණ්ඩයක් එක් කරන්න" },
      description: {
        en: "Fill below form to create product",
        si: "භාණ්ඩයේ තොරතුරු පහත ෆෝරමයේ ඇතුලත් කරන්න."
      },
      form: {
        name: {
          label: { en: "Product Name", si: "භාණ්ඩයේ නම" },
          placeholder: {
            en: "Elephant House - Strawberry Ice Cream (500ml)",
            si: "එලිෆන්ට් හවුස් - ස්ට්‍රෝබෙරි අයිස් ක්‍රීම් (500ml)"
          }
        },
        category: {
          label: { en: "Product Category", si: "භාණ්ඩ වර්ගය" }
        },
        barcode: {
          label: { en: "Barcode Number", si: "බාර්කෝඩ් අංකය" },
          placeholder: {
            en: "Enter barcode number",
            si: "බාර්කෝඩ් අංකය ඇතුලත් කරන්න."
          }
        },
        description: {
          label: { en: "Product Description", si: "භාණ්ඩ විස්තර" },
          placeholder: {
            en: "Delicious strawberry ice cream",
            si: "භාණ්ඩය පිලිබද සටහන් *(අත්‍යාවශ්‍යය නොවේ)"
          }
        },
        unitPrice: {
          label: { en: "Product Price", si: "භාණ්ඩයේ මිල" },
          placeholder: { en: "120.00", si: "120.00" }
        },
        unitAmount: {
          label: { en: "No. of Units", si: "ඒකක ගණන" },
          placeholder: { en: "100", si: "100" }
        },
        discountedPrice: {
          label: { en: "Discounted Price", si: "අපේ මිල" },
          placeholder: { en: "100.00", si: "100.00" }
        },
        stockQuantity: {
          label: { en: "Stock Quantity", si: "ගබඩා ප්‍රමාණය" },
          placeholder: { en: "100", si: "100" }
        },
        productUnit: {
          label: { en: "Product Unit", si: "භාණ්ඩ ඒකකය" },
          placeholder: { en: "Units", si: "ආකාර" }
        },
        isFeatured: {
          label: { en: "Featured Product", si: "ඉක්මන් අයිතමයක්" },
          placeholder: {
            en: "Mark the product as featured for easy access",
            si: "භාණ්ඩය පහසුවෙන් සොයාගැනීමට උපකාරී වේ"
          }
        },
        productImage: {
          label: { en: "Product Image", si: "භාණ්ඩයේ ඡායාරූපය" },
          placeholder: { en: "Upload image", si: "රූපය උඩුගත කරන්න" }
        },
        reset: { en: "Reset", si: "නැවත සකසන්න" },
        create: { en: "Create Product", si: "භාණ්ඩයක් සාදන්න" },
        edit: { en: "Edit Product", si: "භාණ්ඩයක් යාවත්කාලීන කරන්න" }
      }
    }
  },
  customers: {
    title: { en: "All Customers", si: "ඔබේ පාරිභෝගිකයන්" },
    subtitle: {
      en: "Manage your customers",
      si: "ඔබේ පාරිභෝගිකයන් කළමනාකරණය කරන්න"
    },
    update: {
      title: { en: "Update Customer", si: "පාරිභෝගිකයා යාවත්කාලීන කරන්න" },
      description: {
        en: "Make changes to your customer here.",
        si: "යාවත්කාලීන කිරීමට අදාල තොරතුරු පහත ෆෝරමයේ ඇතුලත් කරන්න."
      }
    },
    addNew: {
      en: "Add Customer",
      si: "නව පාරිභෝගිකයෙක් එක් කරන්න",
      subtitle: {
        en: "Fill customer details in following form",
        si: "පාරිභෝගිකයාගේ විස්තර පහත ෆෝරමයේ ඇතුලත් කරන්න."
      },
      form: {
        name: {
          en: "Name",
          si: "පාරිභෝගිකයාගේ නම",
          placeholder: {
            en: "Enter customer name",
            si: "පාරිභෝගිකයාගේ නම ඇතුලත් කරන්න"
          }
        },
        phone: {
          en: "Phone",
          si: "දුරකථන",
          placeholder: {
            en: "Enter customer phone",
            si: "දුරකථන අංකය ඇතුලත් කරන්න"
          }
        },
        address: {
          en: "Address",
          si: "ලිපිනය",
          placeholder: {
            en: "Enter customer address",
            si: "ලිපිනය ඇතුලත් කරන්න"
          }
        },
        currentBalance: {
          en: "Current Balance",
          si: "වත්මන් ණය ශේෂය",
          placeholder: {
            en: "Enter current balance",
            si: "වත්මන් ණය ශේෂය ඇතුලත් කරන්න"
          }
        },
        totalCreditLimit: {
          en: "Total Credit Limit",
          si: "උපරිම ණය සීමාව",
          placeholder: {
            en: "Enter total credit limit",
            si: "උපරිම ණය සීමාව ඇතුලත් කරන්න"
          }
        },
        notes: {
          en: "Additional Notes",
          si: "අමතර සටහන්",
          placeholder: {
            en: "Enter additional notes",
            si: "අමතර සටහන් ඇතුලත් කරන්න"
          }
        }
      }
    }
  },
  transactions: {
    title: { en: "All Transactions", si: "සියලුම ගනුදෙනු" },
    subtitle: {
      en: "Manage your store transactions here",
      si: "ඔබේ ගනුදෙනු මෙහි කළමනාකරණය කරන්න"
    }
  },
  lockScreen: {
    placeholder: {
      en: "Enter your password here",
      si: "ඔබේ මුරපදය මෙහි ඇතුලත් කරන්න"
    },
    button: { en: "Login", si: "ඇතුල්වන්න" }
  }
};
