import Wig from "../assets/images/care_products/hair-extensions/wigs.webp";
import Weavon from "../assets/images/care_products/hair-extensions/hairer.jpeg";
import Attachment from "../assets/images/care_products/hair-extensions/wavyhair.webp";
import Curl from "../assets/images/care_products/hair-extensions/curls.webp";
import Lashes from "../assets/images/care_products/hair-extensions/lash.jpeg";

const extensionsData = [
  {
    id: 1,
    productName: "Luxury Lace Wig",
    shortDescription: "Soft human hair wig with natural parting.",
    productPrice: "$120",
    companyName: "RoyalTresses",
    image: Wig
  },
  {
    id: 2,
    productName: "Deep Wave Weavon",
    shortDescription: "Voluminous and bouncy texture.",
    productPrice: "$70",
    companyName: "HairVibe",
    image: Weavon
  },
  {
    id: 3,
    productName: "Braiding Attachment Pack",
    shortDescription: "Tangle-free and long-lasting synthetic fibers.",
    productPrice: "$25",
    companyName: "BraidQueen",
    image: Attachment
  },
  {
    id: 4,
    productName: "Tight Curls Extension",
    shortDescription: "Perfect for afro-inspired looks.",
    productPrice: "$40",
    companyName: "CurlUp",
    image: Curl
  },
  {
    id: 5,
    productName: "3D Mink Lashes",
    shortDescription: "Reusable and feather-light for glam looks.",
    productPrice: "$15",
    companyName: "LashLux",
    image: Lashes
  }
];

export default extensionsData;
