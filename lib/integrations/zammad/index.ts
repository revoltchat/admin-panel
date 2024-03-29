type TicketMetrics = {
  new: number; // state.name:new
  open: number; // state.name:open
  pending: number; // state.name:pending*
  escalated: number; // escalation_at:<now
};

type SearchResults = {
  tickets: number[];
  tickets_count: number;
  assets: any;
};

/**
 * Search for a given query on Zammad
 * @param query Query
 * @returns Search results
 */
export async function search(query: string): Promise<SearchResults> {
  const result = await fetch(
    `${process.env.INTEGRATION_ZAMMAD_ENDPOINT}/tickets/search?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Token ${process.env.INTEGRATION_ZAMMAD_ACCESS_TOKEN}`,
      },
    },
  );

  return await result.json();
}

/**
 * Query ticket metrics from Zammad
 * @returns Ticket metrics
 */
export async function ticketMetrics(): Promise<TicketMetrics> {
  const results = await Promise.all([
    search("state.name: new"),
    search("state.name: open"),
    search("state.name: pending*"),
    search("escalation_at:<now"),
  ]);

  return {
    new: results[0].tickets_count,
    open: results[1].tickets_count,
    pending: results[2].tickets_count,
    escalated: results[3].tickets_count,
  };
}
