"use client";

import Link from "next/link";
import { Menu } from "antd";
import {
    ProjectOutlined,
    UnorderedListOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const router = useRouter();
    const handleClick = (e: any) => {
        router.push(`/${e.key}`);
    }
    return (
        <div className="h-screen border-r bg-white w-64">

            <Menu
                mode="inline"
                defaultSelectedKeys={["dashboard"]}
                // onClick={handleClick}
                items={[
                    {
                        key: "projects",
                        icon: <ProjectOutlined />,
                        // label: "Projects",
                        label: <Link href="/projects">Projects</Link>,
                    },
                    {
                        key: "tasks",
                        icon: <UnorderedListOutlined />,
                        // label: "Tasks",
                        label: <Link href="/tasks">Tasks</Link>,
                    },
                    {
                        key: "users",
                        icon: <UserOutlined />,
                        // label: "Users",
                        label: <Link href="/users">Users</Link>,
                    },
                ]}
            />

        </div>
    );
}