import React from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useLeads } from "../../contexts/LeadsContext";
import { LeadStatus } from "../../types";
import { getStatusColor } from "../../utils/formatters";
import KanbanColumn from "./KanbanColumn";
import "./KanbanBoard.css";

const KanbanBoard: React.FC = () => {
  const { filteredLeads, updateLead } = useLeads();

  const statuses: LeadStatus[] = [
    "novo",
    "contato",
    "qualificado",
    "proposta",
    "negociacao",
    "ganho",
    "perdido",
  ];

  const getLeadsByStatus = (status: LeadStatus) => {
    return filteredLeads.filter((lead) => lead.status === status);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Se não há destino ou o item foi solto no mesmo lugar
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newStatus = destination.droppableId as LeadStatus;

    try {
      await updateLead(draggableId, { status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status do lead:", error);
      alert("Erro ao mover lead. Tente novamente.");
    }
  };

  return (
    <div className="kanban-board-wrapper">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {statuses.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              leads={getLeadsByStatus(status)}
              color={getStatusColor(status)}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
