// Tipos para los endpoints de Node y Go
export type EndpointStatsNode = {
  count: number;
  avgTime: number;
  totalTime: number;
};
export type EndpointStatsGo = unknown; // Go puede devolver un objeto vacío o unknown

export type TopEndpointNode = {
  endpoint: string;
  count: number;
  avg_time_ms: string;
};
export type TopEndpointGo = unknown; // Go puede devolver null o unknown

export interface MetricsData {
  requests: {
    total: number;
    // Node: Record<string, EndpointStatsNode>, Go: Record<string, unknown>
    byEndpoint: Record<string, EndpointStatsNode | EndpointStatsGo>;
    slowRequests: Array<{
      endpoint: string;
      responseTime: number;
      timestamp: string;
    }> | null;
    errors: Array<{
      endpoint: string;
      statusCode?: number;
      error?: string;
      timestamp: string;
    }> | null;
    total_requests: number;
    slow_requests_count: number;
    errors_count: number;
    // Node: TopEndpointNode[], Go: null o unknown[]
    top_endpoints: Array<TopEndpointNode | TopEndpointGo> | null;
  };
  performance: {
    avgResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number;
    avg_response_time_ms: string;
    max_response_time_ms: string;
    min_response_time_ms: string;
  };
  cache: {
    connected: boolean;
    totalKeys: number;
    byPrefix: Record<string, number>;
    hitRate?: number;
    status: string;
    hit_rate_percentage: string;
    total_hits?: number;
    total_misses?: number;
    total_requests?: number;
  };
  database: {
    activeConnections: number;
    totalQueries: number;
    slowQueries: Array<{
      query?: string;
      executionTime?: number;
      timestamp?: string;
    }>;
    status: string;
    active_connections: number;
  };
  system: {
    memoryUsage: string;
    cpuUsage: string;
    uptime: number;
    memory: {
      heapUsed: string;
      heapTotal?: string;
      external?: string;
      rss?: string;
    };
    cpu: {
      usage_percentage: string;
      user_time?: string;
      system_time?: string;
    };
    uptime_hours?: string;
    node_version?: string;
    platform?: string;
    environment?: string;
  };
  whatsapp: {
    status: string;
    connection: {
      state: string;
      lastSeen: string;
      uptime: string;
      uptime_hours: string;
    };
    messages: {
      total_received: number;
      total_sent: number;
      last_message: string;
      last_message_ago: string;
    };
    clients: {
      active: number;
      total: number;
    };
    qr: {
      generated: boolean;
      last_generation: string | null;
    };
    errors: {
      count: number;
      recent: Array<{
        message?: string;
        timestamp?: string;
        type?: string;
      }>;
    };
    performance: {
      messages_per_minute: number;
      avg_response_time: string;
    };
  };
  redis?: {
    connected: boolean;
    keys: number;
    memory: string;
    status: string;
    memory_mb: string;
  };
  timestamp: string;
  version: string;
  generated_by: string;
} 