"use client"

import type { CategoryTree } from "@/app/types"
import { ChevronDown, ChevronRight, Download, Edit, Copy, Plus, Search, Printer } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface CategoriesTableProps {
    categoryTree: CategoryTree[]
}

export function CategoriesTable({ categoryTree }: CategoriesTableProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId)
        } else {
            newExpanded.add(categoryId)
        }
        setExpandedCategories(newExpanded)
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search categories..." className="pl-9" />
                    </div>
                    <Button variant="outline" size="sm">
                        Filters
                    </Button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Link href="/admin/categories/add">
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                New Category
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[1fr_80px] gap-4 px-6 py-3 border-b bg-muted/50">
                <div className="text-sm font-medium">Name</div>
                <div className="text-sm font-medium">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
                {categoryTree.map((category, index) => (
                    <CategoryRow
                        key={category.id}
                        category={category}
                        depth={0}
                        expanded={expandedCategories}
                        onToggle={toggleCategory}
                        isLast={index === categoryTree.length - 1}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t flex items-center justify-between">
                <Select defaultValue="12">
                    <SelectTrigger className="w-[120px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="12">12 per page</SelectItem>
                        <SelectItem value="24">24 per page</SelectItem>
                        <SelectItem value="48">48 per page</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                    <div className="flex items-center">
                        <Button variant="outline" size="sm" className="rounded-r-none">
                            1
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-none bg-primary text-primary-foreground">
                            2
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-none">
                            3
                        </Button>
                        <span className="px-2 border-y border-input h-8 flex items-center">...</span>
                        <Button variant="outline" size="sm" className="rounded-l-none">
                            10
                        </Button>
                    </div>
                    <Button variant="outline" size="sm">
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

interface CategoryRowProps {
    category: CategoryTree
    depth: number
    expanded: Set<string>
    onToggle: (id: string) => void
    isLast: boolean
}

function CategoryRow({ category, depth, expanded, onToggle, isLast }: CategoryRowProps) {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0
    const isExpanded = expanded.has(category.id)

    return (
        <>
            <div className="grid grid-cols-[1fr_80px] gap-4 px-6 py-3 hover:bg-muted/50 items-center group relative">
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        {depth > 0 && (
                            <div className="absolute left-0 top-0 bottom-0">
                                {Array.from({ length: depth }).map((_, index) => (
                                    <div
                                        key={index}
                                        className={
                                            `ml-8 absolute left-[${19 + index * 24}px] top-0 bottom-0 border-l-2 border-muted-foreground/20 
                                            ${index === depth - 1 && isLast ? "h-1/2" : ""
                                            }`}
                                    />
                                ))}
                                <div
                                    className={`ml-8 absolute left-[${19 + (depth - 1) * 24}px] top-1/2 w-8 border-t-2 border-muted-foreground/20`}
                                />
                            </div>
                        )}
                        <div style={{ paddingLeft: `${depth * 24}px` }} className="flex items-center gap-2">
                            {hasSubcategories && (
                                <button
                                    onClick={() => onToggle(category.id)}
                                    className="h-5 w-5 rounded hover:bg-muted flex items-center justify-center"
                                >
                                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                            )}
                            {!hasSubcategories && <div className="w-5" />}
                            <span className="font-medium">{category.name}</span>
                            {(category.subcategories && category.subcategories.length > 0)
                                && <span className="text-sm text-muted-foreground">({category.subcategories.length})</span>}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div >
            {isExpanded &&
                hasSubcategories &&
                category.subcategories.map((subCategory, index) => (
                    <CategoryRow
                        key={subCategory.id}
                        category={subCategory as CategoryTree}
                        depth={depth + 1}
                        expanded={expanded}
                        onToggle={onToggle}
                        isLast={index === category.subcategories.length - 1}
                    />
                ))
            }
        </>
    )
}

