import * as React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

interface AdminHeaderProps {
    currentPage: string;
    crumbItems?: { name: string; href: string }[];
}

export function AdminHeader({ currentPage, crumbItems }: AdminHeaderProps) {
    return (
        <header className="sticky top-0 w-full flex bg-sidebar items-center border-b p-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mx-2" />
            <div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        {crumbItems && crumbItems.map((item) => (
                            <React.Fragment key={item.name}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                            </React.Fragment>
                        ))}
                        <BreadcrumbItem>
                            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )

}