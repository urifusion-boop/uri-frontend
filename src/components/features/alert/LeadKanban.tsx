import { GetByFiltersLeadsDto, LeadDto } from '@/models/dtos/LeadsDto';
import { FetchNextPageOptions, InfiniteQueryObserverResult, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { LeadsService } from '@/api/LeadsService';
import { queryClient } from '@/configs/query-client.config';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { triggerToast } from '../../atoms/CustomToast';
import LeadBoard from './LeadBoard';

const statuses = Object.values(LeadStatusEnum);

type PaginationFunctionReturn = {
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult<GetByFiltersLeadsDto | null | undefined, unknown>>;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoading: boolean;
} | null;

interface BoardData {
  id: string;
  title: string;
  cards: LeadDto[];
}

interface LeadKanbanProps {
  leads: LeadDto[];
  getPaginationFunction: (status: string) => PaginationFunctionReturn;
}

const LeadKanban = ({ leads, getPaginationFunction }: LeadKanbanProps) => {
  const [boards, setBoards] = useState<BoardData[]>([]);

  const updateStatus = useMutation({
    mutationFn: async ({ lead_id, status }: { lead_id: string; status: string }) => {
      const result = await LeadsService.updateStatus({ lead_id, status });

      if (result.status) {
        queryClient.invalidateQueries({ queryKey: ['leads-data'] });
      } else {
        triggerToast('error', result.responseMessage, 'top-right');
      }
      return result.responseData;
    },
  });

  useEffect(() => {
    setBoards(
      statuses.map((status) => ({
        id: status,
        title: status,
        cards: leads?.filter((lead) => lead.lead_status === status) ?? [],
      }))
    );
  }, [leads]);

  const moveCard = (cardId: string, sourceBoardId: string, targetBoardId: string) => {
    const sourceBoard = boards.find((board) => board.id === sourceBoardId)!;
    const targetBoard = boards.find((board) => board.id === targetBoardId)!;
    const card = sourceBoard.cards.find((card) => card.id === cardId)!;

    sourceBoard.cards = sourceBoard.cards.filter((card) => card.id !== cardId);
    targetBoard.cards = [...targetBoard.cards, { ...card, lead_status: targetBoardId }];

    updateStatus.mutate({ lead_id: card.lead_id ?? '', status: targetBoardId });

    setBoards([...boards]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-4 py-4 bg-white overflow-x-auto scroll">
        {boards.map((board) => (
          <LeadBoard key={board.id} board={board} moveCard={moveCard} getPaginationFunction={getPaginationFunction} />
        ))}
      </div>
    </DndProvider>
  );
};

export default LeadKanban;
