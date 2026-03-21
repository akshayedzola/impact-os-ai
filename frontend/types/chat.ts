export interface IChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
}

export type StructuredOutputType =
  | 'data_model'
  | 'modules'
  | 'dashboards'
  | 'sprint_plan'
  | 'theory_of_change'
  | null;

export interface IStreamingState {
  isStreaming: boolean;
  streamingContent: string;
}
