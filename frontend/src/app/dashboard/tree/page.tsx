"use client";

import { NodeCard as ExternalNodeCard } from "@/components/dashboard/tree/nodes";
import { Heading } from "@/components/ui/heading";
import { baseUrl } from "@/config";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";

export default function DivChartPage() {
  const [treeRaw, setTreeRaw] = useState<any>(null);
  const [treeData, setTreeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });

  // Adapter returns SVG elements (g + foreignObject) — required by react-d3-tree
  const NodeCardAdapter = ({ nodeDatum, toggleNode }) => {
    const { name, attributes = {} } = nodeDatum;
    const avatar = attributes.profilePicture ?? attributes.avatar ?? "";
    const role = attributes.role ?? attributes.type ?? "";
    const email = attributes.email ?? "";

    // Return an SVG group with foreignObject inside (no <div> wrapper)
    // foreignObject renders HTML inside SVG (ensure allowForeignObjects={true} on Tree)
    return (
      <g>
        <foreignObject
          width={260}
          height={110}
          x={-130}
          y={-55}
          xmlns="http://www.w3.org/1999/xhtml"
          style={{ overflow: "visible" }}
          onClick={() => toggleNode && toggleNode(nodeDatum)}
        >
          <div style={{ width: 260 }}>
            {ExternalNodeCard ? (
              <ExternalNodeCard
                name={name}
                role={role}
                email={email}
                avatar={avatar}
              />
            ) : (
              <div
                style={{
                  width: 260,
                  padding: 12,
                  borderRadius: 12,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  background: "#fff",
                  border: "1px solid #eee",
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Image
                    src={avatar || "/default.webp"}
                    alt={name}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 13, fontWeight: 600, color: "#111" }}
                    >
                      {name}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{role}</div>
                    {email && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "#9ca3af",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(800, rect.width),
          height: Math.max(600, rect.height),
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // fetch tree data
  useEffect(() => {
    let cancelled = false;
    const fetchTree = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/divisions/tree`, {
          withCredentials: true,
        });
        const { data } = res.data;
        if (cancelled) return;
        setTreeRaw(data);
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Failed to fetch tree");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTree();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!treeRaw) {
      setTreeData(null);
      return;
    }

    const api = treeRaw;
    let root = null;

    if (api && api.divisions) {
      // root object with divisions (superadmin)
      root = {
        name: api.name || "Superadmin",
        attributes: {
          role: api.role || "SUPERADMIN",
          email: api.email,
          profilePicture: api.profilePicture,
        },
        children: (api.divisions || []).map((div) => ({
          name: div.name,
          attributes: { type: "division" },
          children: (div.departments || []).map((dept) => ({
            name: dept.name,
            attributes: { type: "department" },
            children: (dept.managers || []).map((mgr) => ({
              name: mgr.name,
              attributes: {
                role: mgr.role || "MANAGER",
                email: mgr.email,
                profilePicture: mgr.profilePicture,
              },
              children: (mgr.technicians || []).map((tech) => ({
                name: tech.name,
                attributes: {
                  role: tech.role || "TECHNICIAN",
                  email: tech.email,
                  profilePicture: tech.profilePicture,
                },
              })),
            })),
          })),
        })),
      };
    } else if (Array.isArray(api)) {
      // plain divisions array — wrap in root
      root = {
        name: "Organization",
        attributes: { role: "ROOT" },
        children: api.map((div) => ({
          name: div.name,
          attributes: { type: "division" },
          children: (div.departments || []).map((dept) => ({
            name: dept.name,
            attributes: { type: "department" },
            children: (dept.managers || []).map((mgr) => ({
              name: mgr.name,
              attributes: {
                role: mgr.role || "MANAGER",
                email: mgr.email,
                profilePicture: mgr.profilePicture,
              },
              children: (mgr.technicians || []).map((tech) => ({
                name: tech.name,
                attributes: {
                  role: tech.role || "TECHNICIAN",
                  email: tech.email,
                  profilePicture: tech.profilePicture,
                },
              })),
            })),
          })),
        })),
      };
    } else {
      setTreeData(null);
      return;
    }

    setTreeData(root);
  }, [treeRaw]);

  if (loading) return <div className="p-8">Loading org chart...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!treeData) return <div className="p-8">No data</div>;

  // center root horizontally and give space from top
  const translate = { x: dimensions.width / 2, y: 80 };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Heading
          title="Organizational Chart"
          description="Centered vertical tree with connectors. Click nodes to
            collapse/expand."
        />

        <div
          ref={containerRef}
          className="bg-white p-6 rounded-2xl shadow-lg"
          style={{ height: Math.max(600, dimensions.height) }}
        >
          <Tree
            data={treeData}
            translate={translate}
            orientation="vertical"
            pathFunc="elbow"
            separation={{ siblings: 1.1, nonSiblings: 1.6 }}
            scaleExtent={{ min: 0.4, max: 1.8 }}
            // allowForeignObjects={true}
            nodeSize={{ x: 260, y: 140 }}
            renderCustomNodeElement={(rd3tProps) => (
              <NodeCardAdapter {...rd3tProps} />
            )}
            initialDepth={1}
          />
        </div>
      </div>
    </div>
  );
}
