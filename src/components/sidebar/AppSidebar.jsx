"use client";
import { ChevronDown, ChevronRight, Pin, PinOff } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { sidebarData } from "@/components/sidebar/data";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const router = useRouter();
  const [pinnedItems, setPinnedItems] = useState([]);
  const [openSections, setOpenSections] = useState({});

  const { state } = useSidebar();

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("pinnedItems")) || [];
    setPinnedItems(storedItems);
  }, []);

  const handlePinClick = (subItem) => {
    const allPinnedItems =
      JSON.parse(localStorage.getItem("pinnedItems")) || [];
    const newItem = { title: subItem.title, link: subItem.link };
    allPinnedItems.push(newItem);
    localStorage.setItem("pinnedItems", JSON.stringify(allPinnedItems));
    setPinnedItems(allPinnedItems);
  };

  const handleRemovePinnedItem = (itemToRemove) => {
    const storedItems = JSON.parse(localStorage.getItem("pinnedItems")) || [];
    const updatedItems = storedItems.filter(
      (item) => item.link !== itemToRemove.link
    );
    localStorage.setItem("pinnedItems", JSON.stringify(updatedItems));
    setPinnedItems(updatedItems);
  };

  const handleToggle = (title) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  const renderMenuItem = (item) => {
    const isOpen = openSections[item.title];

    return (
      <SidebarMenuItem key={item.title}>
        {item.subItems ? (
          <Collapsible defaultOpen={isOpen} className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                className="text-[16px]"
                onClick={() => handleToggle(item.title)}
              >
                <item.icon />
                <span className="flex items-center justify-between w-full">
                  <p>{item.title}</p>
                  {isOpen ? <ChevronDown /> : <ChevronRight />}
                </span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.subItems.map((subItem) => renderSubItem(subItem))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarMenuButton>
            <a href={item.link}>
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    );
  };

  const renderSubItem = (subItem) => {
    const isOpen = openSections[subItem.title];
    const isPinned = pinnedItems.some(
      (pinnedItem) => pinnedItem.link === subItem.link
    );

    return (
      <SidebarMenuSubItem key={subItem.title} className="">
        {subItem.subItems ? (
          <Collapsible defaultOpen={isOpen} className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                className="text-[14px]"
                onClick={() => handleToggle(subItem.title)}
              >
                {isOpen ? <ChevronDown /> : <ChevronRight />}
                <span>{subItem.title}</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {subItem.subItems.map((subSubItem) =>
                  renderSubItem(subSubItem)
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <div className="flex justify-between items-center w-[100%] cursor-pointer">
            <span
              onClick={() => router.push(subItem.link)}
              className="w-[90%] text-[14px] hover:bg-[#000099] hover:text-white py-1 px-1 rounded-md hover:cursor-pointer"
            >
              {subItem.title}
            </span>
            {!isPinned && (
              <Pin
                onClick={() => handlePinClick(subItem)}
                className="w-[10%] bg-gray-200 hover:bg-[#000099] hover:text-white shadow rounded-md py-1"
                size={26}
              />
            )}
          </div>
        )}
      </SidebarMenuSubItem>
    );
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        {state === "expanded" && (
          <SidebarGroup>
            <SidebarGroupLabel>Pinned Items</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="text-[16px]">
                {pinnedItems.length > 0 ? (
                  pinnedItems.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton className="text-black">
                        {/* <span>{item.title}</span> */}
                        <div className="flex justify-between items-center w-[100%] cursor-pointer">
                          <span
                            onClick={() => router.push(item.link)}
                            // className="w-[90%]"
                            className="w-[90%] text-[14px] hover:bg-[#000099] hover:text-white py-1 px-1 rounded-md hover:cursor-pointer"
                          >
                            {item.title}
                          </span>
                          <PinOff
                            onClick={() => handleRemovePinnedItem(item)}
                            // className="w-[20%]"
                            // size={16}
                            className="w-[10%] bg-gray-200 hover:bg-[#000099] hover:text-white shadow rounded-md py-1"
                            size={26}
                          />
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled>
                      No pinned items
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <hr />
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="text-[16px]">
              {sidebarData.map((item) => renderMenuItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
