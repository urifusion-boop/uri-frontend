import { LightThemeColors } from '@/configs/colors.config';
import { ColorHelper } from '@/helpers/ColorHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { TaskMangerDto, TasksByFiltersDto } from '@/models/dtos/TaskManagerDto';
import { TaskMangerStatusEnum } from '@/models/enum-models/TaskManagerEnum';
import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';
import { Box, Button, Card, CardContent, Skeleton, Typography, lighten, useMediaQuery } from '@mui/material';
import { FetchNextPageOptions, InfiniteQueryObserverResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa6';
import { GoPlus } from 'react-icons/go';

interface Column {
  id: string;
  title: string;
  tasks?: TaskMangerDto[];
}

type PaginationFunctionReturn = {
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult<TasksByFiltersDto | null | undefined, unknown>>;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoading: boolean;
} | null;

interface KanbanBoardProps {
  columns: Record<string, Column>;
  setColumns: Dispatch<SetStateAction<Record<string, Column>>>;
  handleNewIdea: (status: string) => void;
  loading?: boolean;
  onTaskSelected: (task: TaskMangerDto) => void;
  onDragEndFn: (result: TaskMangerDto) => void;
  onDeleteTask: (taskId: string) => void;
  getPaginationFunction: (status: string) => PaginationFunctionReturn;
}

const KanbanBoard = ({ columns, setColumns, handleNewIdea, loading, onTaskSelected, onDragEndFn, onDeleteTask, getPaginationFunction }: KanbanBoardProps) => {
  const isMobile = useMediaQuery('(max-width:800px)');

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const sourceTasks = [...(sourceColumn?.tasks ?? [])];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceColumn.id === destinationColumn.id) {
      // Move within the same column
      sourceTasks.splice(destination.index, 0, movedTask);
      setColumns({
        ...columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          tasks: sourceTasks,
        },
      });
    } else {
      // Move to a different column
      const destinationTasks = [...(destinationColumn.tasks ?? [])];
      destinationTasks.splice(destination.index, 0, movedTask);

      onDragEndFn({
        ...movedTask,
        status: destinationColumn.id as TaskMangerStatusEnum,
      });

      setColumns({
        ...columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          tasks: sourceTasks,
        },
        [destinationColumn.id]: {
          ...destinationColumn,
          tasks: destinationTasks,
        },
      });
    }
  };

  const progressColors: Record<string, string> = {
    [TaskMangerStatusEnum.TO_DO]: '#000080',
    [TaskMangerStatusEnum.IN_PROGRESS]: '#FFD700',
    [TaskMangerStatusEnum.DONE]: '#32CD32',
  };

  const getGridAreas = (attachmentLength: number) => {
    switch (attachmentLength) {
      case 1:
        return `"image1 image1" 
                "image1 image1"`;
      case 2:
        return `"image1 image2" 
                "image1 image2"`;
      case 3:
        return `"image1 image2" 
                "image3 image3"`;
      case 4:
        return `"image1 image2" 
                "image3 image4"`;
      default:
        return ``;
    }
  };

  return loading ? (
    <Box
      sx={{
        overflowX: 'auto',
        display: 'flex',
        gap: 3,
        alignItems: 'flex-start',
        height: 400,
      }}
      className="scroll"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton width={350} height={400} variant="rectangular" animation="wave" key={index} />
      ))}
    </Box>
  ) : (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          overflowX: 'auto',
        }}
        className="scroll"
      >
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            alignItems: 'flex-start',
            pb: 3,
          }}
        >
          {Object.entries(columns).map(([columnId, column]) => (
            <Box
              key={columnId}
              minWidth={300}
              bgcolor={lighten(LightThemeColors.uriColor, 0.9)}
              py={2}
              px={3}
              sx={{
                maxHeight: isMobile ? 'calc(100svh - 275px)' : 'calc(100svh - 228px)',
                overflowY: 'auto',
              }}
              className="scroll"
              onScroll={(e) => {
                const bottom = Math.ceil(e.currentTarget.scrollTop + e.currentTarget.clientHeight) >= e.currentTarget.scrollHeight;

                if (bottom && !getPaginationFunction(column.id)?.isFetchingNextPage) {
                  getPaginationFunction(column.id)?.hasNextPage && getPaginationFunction(column.id)?.fetchNextPage();
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      bgcolor: progressColors[column.id] ?? ColorHelper.generateRandomColor(),
                      marginRight: 1,
                    }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    {column.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    fontSize={12}
                    sx={{
                      bgcolor: '#fff',
                      padding: '2px 6px',
                      borderRadius: 10,
                    }}
                  >
                    {column.tasks ? column?.tasks.length : 0}
                  </Typography>
                </Box>
                <GoPlus size={20} onClick={() => handleNewIdea(column?.id)} style={{ cursor: 'pointer' }} />
              </Box>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps} borderRadius={2} minHeight="200px">
                    {column.tasks &&
                      column.tasks.map((task, index) => (
                        <Draggable key={task.taskId} draggableId={task.taskId + ''} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                marginBottom: 2,
                                bgcolor: 'white',
                                boxShadow: 1,
                                borderLeft: `5px solid ${progressColors[column.id] ?? ColorHelper.generateRandomColor()}`,
                                maxWidth: 300,
                                position: 'relative',
                              }}
                              onClick={() => onTaskSelected(task)}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  gap: 1,
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                  zIndex: 10,
                                  backgroundColor: 'white',
                                  cursor: 'pointer',
                                  padding: 1,
                                  borderRadius: 5,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteTask(task.taskId ?? '');
                                }}
                              >
                                <FaTrash
                                  size={15}
                                  style={{
                                    color: 'red',
                                  }}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(2, 1fr)',
                                  gridTemplateRows: 'repeat(2, 1fr)',
                                  gap: 1,
                                  gridTemplateAreas: getGridAreas(task.attachments?.slice(0, 4)?.length ?? 0),
                                  position: 'relative',
                                }}
                              >
                                {task?.attachments?.slice(0, 4).map((image, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      width: '100%',
                                      height: task?.attachments?.slice(0, 4).length === 1 ? '200px' : '100px',
                                      objectFit: 'cover',
                                      borderRadius: 1,
                                      gridArea: `image${index + 1}`,
                                    }}
                                  >
                                    {image.docType.startsWith('video') ? (
                                      <video
                                        src={TextHelper.setUrl(image.url)}
                                        autoPlay
                                        loop
                                        muted
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                          borderRadius: 1,
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={TextHelper.setUrl(image.url)}
                                        alt={`Image ${index + 1}`}
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                          borderRadius: 1,
                                        }}
                                      />
                                    )}
                                  </Box>
                                ))}

                                <Box
                                  sx={{
                                    backgroundColor: 'white',
                                    position: 'absolute',
                                    bottom: 10,
                                    right: 10,
                                    padding: '2px 7px',
                                    borderRadius: 10,
                                    display: task?.attachments && task?.attachments?.length > 4 ? 'flex' : 'none',
                                    fontSize: 12,
                                  }}
                                >
                                  +{task.attachments && task.attachments?.length > 4 ? task.attachments?.length - 4 : 0}
                                </Box>
                              </Box>
                              <CardContent>
                                <Typography gutterBottom fontSize={16} fontWeight={600}>
                                  {task.title}
                                </Typography>
                                <Typography>{TextHelper.truncateText(task.description ?? '', 150, '...')}</Typography>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                    {getPaginationFunction(column.id)?.isFetchingNextPage && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 1,
                          mt: 2,
                        }}
                      >
                        <Skeleton width={'100%'} height={100} variant="rectangular" animation="wave" />
                      </Box>
                    )}
                    {column.id === TaskMangerStatusEnum.TO_DO && (
                      <Button
                        onClick={() => handleNewIdea(column.id)}
                        sx={{
                          width: '100%',
                          color: '#000',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 1,
                          mt: 2,
                        }}
                      >
                        <BsPlusLg size={16} />

                        <Typography variant="button">New Idea</Typography>
                      </Button>
                    )}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Box>
      </Box>
    </DragDropContext>
  );
};

export default KanbanBoard;
