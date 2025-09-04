import Clipper from "../assets/images/care_products/gadgets/Clipper.avif";
import Dryer from "../assets/images/care_products/gadgets/dryer.webp";
import Straight from "../assets/images/care_products/gadgets/Cleaner.avif";
import Comb from "../assets/images/care_products/gadgets/combs.webp";
import Clip from "../assets/images/care_products/gadgets/clip.avif";
import Bonnet from "../assets/images/care_products/gadgets/bonnet.avif";

const gadgetsData = [
  {
    id: 1,
    productName: "Professional Hair Clipper",
    shortDescription: "Rechargeable clipper with precision blades.",
    productPrice: "$45",
    companyName: "Andis",
    image: Clipper,
    type: "gadget"
  },
  {
    id: 2,
    productName: "Hair Dryer Pro",
    shortDescription: "Fast-drying with ionic technology.",
    productPrice: "$60",
    companyName: "Revlon",
    image: Dryer,
    type: "gadget"
  },
  {
    id: 3,
    productName: "Wig Straightener",
    shortDescription: "Ceramic plates, ideal for wigs and natural hair.",
    productPrice: "$38",
    companyName: "Conair",
    image: Straight,
    type: "gadget"
  },
  {
    id: 4,
    productName: "Detangling Comb Set",
    shortDescription: "Perfect for pain-free detangling.",
    productPrice: "$10",
    companyName: "Kitsch",
    image: Comb,
    type: "accessory"
  },
  {
    id: 5,
    productName: "Hair Bonnet",
    shortDescription: "Silk bonnet for overnight protection.",
    productPrice: "$8",
    companyName: "SatinPro",
    image: Bonnet,
    type: "accessory"
  },
  {
    id: 6,
    productName: "Hair Clips Pack",
    shortDescription: "Strong grip and stylish colors.",
    productPrice: "$6",
    companyName: "Goody",
    image: Clip,
    type: "accessory"
  }
];

export default gadgetsData;
