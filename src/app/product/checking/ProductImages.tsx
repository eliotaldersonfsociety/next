import Image from "next/image";

type ProductImagesProps = {
  images: { src: string }[];
  mainImage: string;
  setMainImage: (image: string) => void;
};

const ProductImages = ({ images, mainImage, setMainImage }: ProductImagesProps) => (
  <div className="space-y-4">
    <div className="relative square rounded-lg overflow-hidden">
      <Image
        src={mainImage}
        alt="Main product"
        width={600}
        height={200}
        className="object-cover rounded-lg"
      />
    </div>
    <div className="flex gap-2">
      {images.slice(1).map((image, index) => (
        <div key={index} className="relative">
          <Image
            src={image.src || "/placeholder.svg"}
            alt={`View ${index + 1}`}
            width={600}
            height={100}
            className="object-cover rounded-lg cursor-pointer"
            onClick={() => setMainImage(image.src)}
          />
        </div>
      ))}
    </div>
  </div>
);

export default ProductImages;
