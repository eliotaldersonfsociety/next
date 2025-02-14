import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";  // Ajusta la ruta
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";  // Ajusta la ruta
import { Label } from "@/components/ui/label";  // Ajusta la ruta

type ProductAttributesProps = {
  attributes: { name: string; options: string[] }[]; // Cambié 'value' a 'options'
};

const ProductAttributes = ({ attributes }: ProductAttributesProps) => (
  <div className="space-y-4">
    {attributes.map((attr) => (
      <div key={attr.name}>
        <h3 className="text-lg font-semibold mb-2">{attr.name}</h3>
        {attr.options.length > 4 ? (
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Select ${attr.name}`} />
            </SelectTrigger>
            <SelectContent>
              {attr.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <RadioGroup defaultValue={attr.options[0]} className="flex gap-2">
            {attr.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${attr.name}-${option}`} />
                <Label htmlFor={`${attr.name}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    ))}
  </div>
);

export default ProductAttributes;
