export type CommonFields = {
  id: string;                
  internal_id?: string;     
  createdBy: string;         
  blockNumber: number;       
  blockTimestamp: number;    
  transactionHash: string;   
  __typename: string;
};

export type VirtueperkCommonField = {
  cuid: string;
  createdBy: string;
  updatedBy: string;
};
