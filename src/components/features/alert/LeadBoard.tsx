import { GetByFiltersLeadsDto, LeadDto } from '@/models/dtos/LeadsDto';
import { Avatar, Box, Skeleton, Typography } from '@mui/material';
import { FetchNextPageOptions, InfiniteQueryObserverResult } from '@tanstack/react-query';
import { useDrag, useDrop } from 'react-dnd';

import { LightThemeColors } from '@/configs/colors.config';
import { TextHelper } from '@/helpers/TextHelper';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import { TbTargetArrow } from 'react-icons/tb';
import PlatformIcon from '../../atoms/PlatformIcons';

type InterestLevel = 'high' | 'medium' | 'low';

type PaginationFunctionReturn = {
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult<GetByFiltersLeadsDto | null | undefined, unknown>>;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoading: boolean;
} | null;

interface BoardProps {
  board: BoardData;
  moveCard: (cardId: string, sourceBoardId: string, targetBoardId: string) => void;
  getPaginationFunction: (status: string) => PaginationFunctionReturn;
}

interface CardProps {
  card: LeadDto;
}

export interface UserData {
  lead_name: string;
  contact: string;
  status: string;
  lead_source: string;
  id: number;
  lead_owner: string;
}

export interface BoardData {
  id: string;
  title: string;
  cards: LeadDto[];
}

const LeadBoard: React.FC<BoardProps> = ({ board, moveCard, getPaginationFunction }) => {
  const [, drop] = useDrop({
    accept: 'CARD',
    drop: (item: { id: string; status: string }) => {
      if (item.status !== board.id) {
        moveCard(item.id, item.status, board.id);
      }
    },
  });

  const statusColor = {
    [LeadStatusEnum.NEW]: {
      bgColor: '#FFC2E233',
      countColor: '#FFC2E2B2',
    },
    [LeadStatusEnum.CONTACTED]: {
      bgColor: '#FFE9C233',
      countColor: '#FDE1BA',
    },
    [LeadStatusEnum.QUALIFIED]: {
      bgColor: '#C2EDFF33',
      countColor: '#C1E7FA',
    },
    [LeadStatusEnum.UNQUALIFIED]: {
      bgColor: '#EC1F1F33',
      countColor: '#F48585',
    },
    [LeadStatusEnum.CONVERTED]: {
      bgColor: '#2EE51933',
      countColor: '#2BF115',
    },
  };

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className="min-w-[400px] p-4 rounded  bg-[#F6F6F680]  overflow-y-auto no-scroll"
      style={{ height: 'calc(100vh - 300px)' }}
      onScroll={(e) => {
        const bottom = Math.ceil(e.currentTarget.scrollTop + e.currentTarget.clientHeight) >= e.currentTarget.scrollHeight;

        if (bottom && !getPaginationFunction(board.id)?.isFetchingNextPage) {
          getPaginationFunction(board.id)?.hasNextPage && getPaginationFunction(board.id)?.fetchNextPage();
        }
      }}
    >
      <Box
        className={`mb-4 py-3 pr-4 rounded flex gap-2 items-center justify-between`}
        sx={{
          backgroundColor: statusColor[board.id as LeadStatusEnum].bgColor,
        }}
      >
        <Typography className={`text-xs pl-4 font-semibold`}>{board.title}</Typography>
        <Typography
          sx={{
            backgroundColor: statusColor[board.id as LeadStatusEnum].countColor,
            padding: '2px 12px',
            borderRadius: '3px',
          }}
          fontSize={'16px'}
        >
          {board?.cards?.length}
        </Typography>
      </Box>
      {board.cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
      {getPaginationFunction(board.id)?.isFetchingNextPage && <Skeleton variant="rectangular" animation="wave" height={100} width="100%" />}
    </div>
  );
};

const Card: React.FC<CardProps> = ({ card }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { id: card.id, status: card.lead_status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const interestLevelColor: {
    [key in InterestLevel]: { color: string };
  } = {
    high: {
      color: '#0CD61A',
    },
    medium: {
      color: '#DA8C1F',
    },
    low: {
      color: '#C30D0D',
    },
  };

  return (
    <Box
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`p-4 mb-3  bg-white ${isDragging ? 'opacity-50 card-dragging scale-105 transform' : 'opacity-100'} transition-all duration-200`}
      sx={{
        boxShadow: '-1px 1px 2px 0px #0000000D',
        borderRadius: '6px',
      }}
    >
      <div>
        <div className="flex items-start gap-2 justify-between">
          <div>
            <a
              href={TextHelper.formatUrl(card.lead_link ?? card.social_profile_link ?? '')}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
              }}
            >
              <Typography
                className="text-sm font-[600]"
                sx={{
                  color: LightThemeColors.uriColor,
                }}
              >
                {TextHelper.truncateText(card.username, 30, '')}
              </Typography>
            </a>
            <Typography className="text-xs text-[#767676]">{card.industry}</Typography>
          </div>

          <a
            href={TextHelper.formatUrl(card.lead_link ?? '')}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: LightThemeColors.uriColor,
              textDecoration: 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#F6F6F680',
                position: 'relative',
              }}
            >
              <Avatar src={card.picture_url ?? 'https://randomuser.me/api/portraits'} className="w-8 h-8" />
              <Box
                sx={{
                  position: 'absolute',
                  right: 0,
                  bottom: -10,
                }}
              >
                <PlatformIcon platform={TextHelper.getDomainName(card.social_profile_link ?? '')} size={20} />
              </Box>
            </Box>
          </a>
        </div>
        <div className="space-y-2">
          {/* <div className="flex items-center mt-2 gap-1">
            <BsBuildings size={16} />
            <Typography className="text-xs font-[400] ml-3">
              {card.company_name || "No Company Name"}
            </Typography>
          </div> */}
          <div className="flex items-center gap-1 mt-2">
            <TbTargetArrow size={16} />
            <Typography
              sx={{
                color: interestLevelColor[card?.interest_level?.toLocaleLowerCase() as InterestLevel]?.color,
                fontSize: '12px',
                fontWeight: 400,
                width: 'fit-content',
              }}
            >
              {card?.interest_level}
            </Typography>
          </div>
          <Typography className="text-xs font-[500] text-[#363636] ml-3">{TextHelper.truncateText(card.summary_of_mention, 80, '')}</Typography>
        </div>
      </div>
    </Box>
  );
};

export default LeadBoard;
