import type {Access} from 'payload';

// Durable invariant (plan 2.8 / tests 7.4): anonymous callers only ever see
// published documents. Authenticated staff see drafts/archived too. Returning a
// query constraint (rather than a boolean) lets Payload filter list results, so
// drafts never leak through GraphQL/REST list endpoints.
export const readPublished: Access = ({req: {user}}) => {
  if (user) return true;
  return {
    _status: {equals: 'published'},
  };
};
