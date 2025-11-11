import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Lead, LeadStatus } from "../../types";
import { getStatusLabel } from "../../utils/formatters";
import LeadCard from "./LeadCard";
import "./KanbanColumn.css";

interface KanbanColumnProps {
  status: LeadStatus;
  leads: Lead[];
  color: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  leads,
  color,
}) => {
  return (
    <div className="kanban-column">
      <div className="column-header" style={{ borderLeftColor: color }}>
        <h3 className="column-title">{getStatusLabel(status)}</h3>
        <span className="column-count">{leads.length}</span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-content ${
              snapshot.isDraggingOver ? "dragging-over" : ""
            }`}
          >
            {leads.length === 0 ? (
              <div className="empty-column">
                <p>Nenhum lead neste estágio</p>
              </div>
            ) : (
              leads.map((lead, index) => (
                <Draggable key={lead.id} draggableId={lead.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1,
                      }}
                    >
                      <LeadCard lead={lead} />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
