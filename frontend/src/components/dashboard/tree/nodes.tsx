"use client";
import { TreeNode } from "react-organizational-chart";

export const NodeCard = ({ avatar, name, role, email }) => {
  return (
    <div className="w-64 p-3 rounded-2xl shadow-md bg-white border border-gray-100">
      <div className="flex items-center gap-3">
        <img
          src={avatar || "/default.webp"}
          alt={name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
        />
        <div>
          <div className="text-sm font-semibold text-gray-800">{name}</div>
          <div className="text-xs text-gray-500">{role}</div>
          {email && (
            <div className="text-xs text-gray-400 truncate">{email}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DivisionNode = ({ division }) => {
  return (
    <TreeNode label={<NodeCard name={division.name} role="Division" />}>
      <div className="flex gap-6 mt-4 flex-wrap justify-center">
        {division.departments.map((dept) => (
          <DepartmentNode key={dept.id} department={dept} />
        ))}
      </div>
    </TreeNode>
  );
};

const DepartmentNode = ({ department }) => {
  return (
    <TreeNode label={<NodeCard name={department.name} role="Department" />}>
      <div className="flex gap-4 mt-4 flex-wrap justify-center">
        {department.managers && department.managers.length ? (
          department.managers.map((m) => <ManagerNode key={m.id} manager={m} />)
        ) : (
          <div className="text-sm text-gray-500 p-2">No managers</div>
        )}
      </div>
    </TreeNode>
  );
};

const ManagerNode = ({ manager }) => {
  return (
    <TreeNode
      label={
        <NodeCard
          name={manager.name}
          role={manager.role}
          email={manager.email}
          avatar={manager.profilePicture}
        />
      }
    >
      <div className="flex gap-3 mt-3 flex-col items-center">
        {manager.technicians && manager.technicians.length ? (
          manager.technicians.map((t) => (
            <TreeNode
              key={t.id}
              label={
                <NodeCard
                  name={t.name}
                  role={t.role}
                  email={t.email}
                  avatar={t.profilePicture}
                />
              }
            ></TreeNode>
          ))
        ) : (
          <div className="text-xs text-gray-400 p-2">No technicians</div>
        )}
      </div>
    </TreeNode>
  );
};
