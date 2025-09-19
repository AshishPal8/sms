// components/dashboard/tree/OrgTreeClient.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { baseUrl } from "@/config";

const Tree = dynamic(() => import("react-d3-tree"), {
  ssr: false,
  loading: () => <div className="p-8">Loading tree component...</div>,
});

const NodeCard = dynamic(
  () => import("./nodes").then((mod) => ({ default: mod.NodeCard })),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);
import Image from "next/image";

export default function OrgTreeClient() {
  const [treeRaw, setTreeRaw] = useState<any>(null);
  const [treeData, setTreeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

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
  }, [isMounted]);

  // fetch tree data
  useEffect(() => {
    if (!isMounted) return;

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
  }, [isMounted]);

  useEffect(() => {
    if (!treeRaw) {
      setTreeData(null);
      return;
    }
    const api = treeRaw;
    let root = null;

    if (api && api.divisions) {
      root = {
        name: api.name || "Superadmin",
        attributes: {
          role: api.role || "SUPERADMIN",
          email: api.email,
          profilePicture: api.profilePicture,
        },
        children: (api.divisions || []).map((div) => ({
          name: div.name,
          attributes: {
            type: "division",
            profilePicture: div.profilePicture ?? null,
          },
          children: (div.departments || []).map((dept) => ({
            name: dept.name,
            attributes: {
              type: "department",
              profilePicture: dept.profilePicture ?? null,
            },
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
      root = {
        name: "Organization",
        attributes: { role: "ROOT" },
        children: api.map((div) => ({
          name: div.name,
          attributes: {
            type: "division",
            profilePicture: div.profilePicture ?? null,
          },
          children: (div.departments || []).map((dept) => ({
            name: dept.name,
            attributes: {
              type: "department",
              profilePicture: dept.profilePicture ?? null,
            },
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

  // Node renderer (SVG <g> + <foreignObject>)
  const NodeCardAdapter = ({ nodeDatum, toggleNode }) => {
    const { name, attributes = {} } = nodeDatum;
    const type = attributes.type ?? attributes.role ?? "";
    const defaultAvatar =
      type === "division"
        ? "/division.png"
        : type === "department"
        ? "/department.png"
        : "/default.webp";
    const avatar =
      attributes.profilePicture ?? attributes.avatar ?? defaultAvatar;
    const role = attributes.role ?? attributes.type ?? "";
    const email = attributes.email ?? "";

    return (
      <g>
        <foreignObject
          width={260}
          height={110}
          x={-130}
          y={-55}
          xmlns="http://www.w3.org/1999/xhtml"
          style={{ overflow: "visible", cursor: "pointer" }}
          onClick={() => toggleNode && toggleNode(nodeDatum)}
        >
          <div style={{ width: 260 }}>
            {NodeCard ? (
              <NodeCard name={name} role={role} email={email} avatar={avatar} />
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

  if (!isMounted) {
    return <div className="p-8">Loading...</div>;
  }

  if (loading) return <div className="p-8">Loading org chart...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!treeData) return <div className="p-8">No data</div>;

  const translate = { x: dimensions.width / 2, y: 80 };

  return (
    <div
      ref={containerRef}
      className="bg-white p-6 rounded-2xl shadow-lg"
      style={{ height: Math.max(600, dimensions.height) }}
    >
      {/* Tree is dynamically imported; allowForeignObjects must be true */}
      <Tree
        data={treeData}
        translate={translate}
        orientation="vertical"
        pathFunc="elbow"
        separation={{ siblings: 1.1, nonSiblings: 1.6 }}
        scaleExtent={{ min: 0.4, max: 1.8 }}
        allowForeignObjects
        nodeSize={{ x: 260, y: 140 }}
        renderCustomNodeElement={(rd3tProps) => (
          <NodeCardAdapter {...rd3tProps} />
        )}
        initialDepth={1}
      />
    </div>
  );
}
