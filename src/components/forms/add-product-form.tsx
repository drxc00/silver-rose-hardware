"use client"

import { useState } from "react"
import { Plus, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddProductForm() {
    const [variants, setVariants] = useState([{ attributes: {}, price: "" }])
    const [images, setImages] = useState<string[]>([])

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        // Here you would typically send the form data to your backend
        console.log("Form submitted")
    }

    const addVariant = () => {
        setVariants([...variants, { attributes: {}, price: "" }])
    }

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index))
    }

    const handleVariantChange = (index: number, field: string, value: string) => {
        const newVariants = [...variants]
        if (field === "price") {
            newVariants[index].price = value
        } else {
            newVariants[index].attributes = { ...newVariants[index].attributes, [field]: value }
        }
        setVariants(newVariants)
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
            setImages([...images, ...newImages])
        }
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-xl font-bold mb-6">Product Details</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" placeholder="Enter product name" required />
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter product description" required />
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tools">Tools</SelectItem>
                            <SelectItem value="hardware">Hardware</SelectItem>
                            <SelectItem value="electrical">Electrical</SelectItem>
                            <SelectItem value="plumbing">Plumbing</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Variants</Label>
                    {variants.map((variant, index) => (
                        <div key={index} className="flex flex-wrap items-end gap-4 mt-2 p-4 border rounded-md">
                            <div>
                                <Label htmlFor={`attribute-${index}`}>Attribute</Label>
                                <Input
                                    id={`attribute-${index}`}
                                    placeholder="e.g., Size, Color"
                                    onChange={(e) => handleVariantChange(index, "attribute", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`value-${index}`}>Value</Label>
                                <Input
                                    id={`value-${index}`}
                                    placeholder="e.g., Large, Red"
                                    onChange={(e) => handleVariantChange(index, "value", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`price-${index}`}>Price</Label>
                                <Input
                                    id={`price-${index}`}
                                    type="number"
                                    placeholder="Enter price"
                                    value={variant.price}
                                    onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeVariant(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={addVariant} className="mt-2">
                        <Plus className="h-4 w-4 mr-2" /> Add Variant
                    </Button>
                </div>

                <div>
                    <Label htmlFor="images">Product Images</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`Product ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-md"
                            />
                        ))}
                        <Label
                            htmlFor="image-upload"
                            className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer"
                        >
                            <Upload className="h-6 w-6" />
                        </Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    Add Product
                </Button>
            </form>
        </div>
    )
}

