"use client";

import Sidebar from "../../components/Sidebar";
import StatCard from "./statCard";
import { Card, Col, Row } from "antd";
import { useProtectedRoute } from "@/src/hooks/useProtectedRoute";

export default function DashboardPage() {
    useProtectedRoute();
    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-1">
                 <Sidebar /> 
                <div className="flex-1 p-6 bg-gray-100"> 
                    <h2 className="text-2xl font-semibold mb-6">
                        Dashboard
                    </h2>
                    <Row gutter={16}>

                        <Col span={8}>
                            <Card title="Projects">
                                12 Active Projects
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card title="Tasks">
                                58 Pending Tasks
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card title="Users">
                                10 Team Members
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>

    );
}

{/* <div className="grid grid-cols-3 gap-6">

                    <StatCard title="Tasks" value="24" />
                    <StatCard title="Completed" value="18" />
                    <StatCard title="Teams" value="5" />

                </div> */}