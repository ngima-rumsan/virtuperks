// AppRegistry Queries
export const AppRegistryQueries = {
  getAppCreated: `
    query GetAppCreated {
      appCreateds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        appId
        admin
        sender
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `,
  getAppCreatedById: `
  query GetAppCreatedById($id: ID!) {
    appCreated(id: $id) {
      id
      appId
      admin
      sender
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`,
  getRoleManagement: `
    query GetRoleManagement {
      roleGranteds(first: 10) {
        id
        appId
        role
        account
        sender
        blockNumber
        blockTimestamp
      }
      roleRevokeds(first: 10) {
        id
        appId
        role
        account
        sender
        blockNumber
      }
      roleAdminGranteds(first: 10) {
        id
        appId
        role
        account
        sender
        blockNumber
      }
      roleAdminRevokeds(first: 10) {
        id
        appId
        role
        account
        sender
        blockNumber
      }
    }
  `,

  getRoleGrantedById: `
  query GetRoleGrantedById($id: ID!) {
    roleGranted(id: $id) {
      id
      appId
      role
      account
      sender
      blockNumber
      blockTimestamp
    }
  }
`,
getRoleRevokedById: `
query GetRoleRevokedById($id: ID!) {
  roleRevoked(id: $id) {
    id
    appId
    role
    account
    sender
    blockNumber
  }
}
`,
getRoleAdminGrantedById: `
  query GetRoleAdminGrantedById($id: ID!) {
    roleAdminGranted(id: $id) {
      id
      appId
      role
      account
      sender
      blockNumber
    }
  }
`,
getRoleAdminRevokedById: `
  query GetRoleAdminRevokedById($id: ID!) {
    roleAdminRevoked(id: $id) {
      id
      appId
      role
      account
      sender
      blockNumber
    }
  }
`,
  
};

// RewardToken Queries
export const TokenQueries = {
  getTransfers: `
    query GetTransfers {
      transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        from
        to
        value
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `,
  getTransferById: `
  query GetTransferById($id: ID!) {
    transfer(id: $id) {
      id
      from
      to
      value
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`,

  getApprovals: `
    query GetApprovals {
      approvals(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        owner
        spender
        value
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `,

  getApprovalById: `
  query GetApprovalById($id: ID!) {
    approval(id: $id) {
      id
      owner
      spender
      value
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`,
};


export const getTaskCreation = `
    query GetTaskCreation {
      taskCreateds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        internal_id
        taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
        rewardManagement{
        appId
        id
        name
        rewardManagement
        }
        createdBy
        blockNumber
        blockTimestamp
        transactionHash
      }
  
    }
  `;


export const getTaskCreatedById = `
  query GetTaskCreatedById($id: ID!) {
    taskCreated(id: $id) {
      id
      internal_id
       taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
        rewardManagement{
        appId
        id
        name
        rewardManagement
        }
      createdBy
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;
// to get the partcipant status by task id
export const GetPendingParticipantsByTask = `
  query GetTaskParticipantsWithStatus($taskId: Bytes!) {
    participantTaskStatuses(where: { taskId: $taskId , status:"PENDING"}) {
      id
      participant
      taskId
      status
      lastUpdatedBlock
      lastUpdatedTimestamp
     taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
        rewardManagement{
        appId
        id
        name
        rewardManagement
        }
    }
  }
`;


export const GetAcceptedParticipantsByTask = `
  query GetTaskParticipantsWithStatus($taskId: Bytes!) {
    participantTaskStatuses(where: { taskId: $taskId , status:"ACCEPTED"}) {
      id
      participant
      taskId
      status
      lastUpdatedBlock
      lastUpdatedTimestamp
     taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
        rewardManagement{
        appId
        id
        name
        rewardManagement
        }
    }
  }
`;



export const getApprovedAndCompletedByTask = `
query GetApprovedAndCompleted($taskId: Bytes!) {
  taskCompleteds(where: { internal_id: $taskId }) {
    id
    internal_id
    participant
    blockNumber
    blockTimestamp
    taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
  }
  taskVerifieds(where: { internal_id: $taskId }) {
    id
    internal_id
    participant
    verifier
    blockNumber
    blockTimestamp
    taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
  }
}

`;

// RewardManagement Queries
export const RewardManagementQueries = {
  
 
getTaskDetailsUpdatedById: `
  query GetTaskDetailsUpdatedById($id: ID!) {
    taskDetailsUpdated(id: $id) {
      id
      internal_id
       taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
      updatedBy
      blockNumber
      blockTimestamp
    }
  }
`,
getParticipantAppliedById: `
  query GetParticipantAppliedById($id: ID!) {
    participantApplied(id: $id) {
      id
      internal_id
       taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
      participant
      blockNumber
      blockTimestamp
    }
  }
`,
getTaskAcceptedById: `
  query GetTaskAcceptedById($id: ID!) {
    taskAccepted(id: $id) {
      id
      internal_id
      participant
      blockNumber
      blockTimestamp
    }
  }
`,
getTaskCompletedById: `
  query GetTaskCompletedById($id: ID!) {
    taskCompleted(id: $id) {
      id
      internal_id
      participant
      blockNumber
      blockTimestamp
    }
  }
`,
getTaskVerifiedById: `
  query GetTaskVerifiedById($id: ID!) {
    taskVerified(id: $id) {
      id
      internal_id
      participant
      verifier
      blockNumber
      blockTimestamp
    }
  }
`,
getParticipantWhitelistedById: `
  query GetParticipantWhitelistedById($id: ID!) {
    participantWhitelisted(id: $id) {
      id
      taskId
      participant
      by
      blockNumber
      blockTimestamp
    }
  }
`,
getParticipantRemovedFromWhitelistById: `
  query GetParticipantRemovedFromWhitelistById($id: ID!) {
    participantRemovedFromWhitelist(id: $id) {
      id
      taskId
      participant
      by
      blockNumber
      blockTimestamp
    }
  }
`,
getDisbursementToTaskById: `
  query GetDisbursementToTaskById($id: ID!) {
    disbursementToTask(id: $id) {
      id
      taskId
      amount
      disbursedBy
      blockNumber
      blockTimestamp
    }
  }
`,
getAdditionalDisbursementToTaskById: `
  query GetAdditionalDisbursementToTaskById($id: ID!) {
    additionalDisbursementToTask(id: $id) {
      id
      taskId
      amount
      remarks
      disbursedBy
      blockNumber
      blockTimestamp
    }
  }
`,
getContractPausedById: `
  query GetContractPausedById($id: ID!) {
    contractPaused(id: $id) {
      id
      by
      blockNumber
      blockTimestamp
    }
  }
`,
getContractUnpausedById: `
  query GetContractUnpausedById($id: ID!) {
    contractUnpaused(id: $id) {
      id
      by
      blockNumber
      blockTimestamp
    }
  }
`,

  getParticipationStatus: `
    query GetParticipationStatus($taskId: Bytes!) {
      participantApplieds(where: { internal_id: $taskId }) {
        id
        internal_id
        participant
        blockNumber
        blockTimestamp
      }
      taskAccepteds(where: { internal_id: $taskId }) {
        id
        internal_id
        participant
        blockNumber
        blockTimestamp
      }
      taskCompleteds(where: { internal_id: $taskId }) {
        id
        internal_id
        participant
        blockNumber
        blockTimestamp
      }
      taskVerifieds(where: { internal_id: $taskId }) {
        id
        internal_id
        participant
        verifier
        blockNumber
        blockTimestamp
      }
    }
  `,

  getWhitelistStatus: `
    query GetWhitelistStatus($taskId: Bytes!) {
      participantWhitelisteds(where: { taskId: $taskId }) {
        id
        taskId
        participant
        by
        blockNumber
        blockTimestamp
      }
      participantRemovedFromWhitelists(where: { taskId: $taskId }) {
        id
        taskId
        participant
        by
        blockNumber
        blockTimestamp
      }
    }
  `,

  getDisbursements: `
    query GetDisbursements($taskId: Bytes!) {
      disbursementToTasks(where: { taskId: $taskId }) {
        id
        taskId
        amount
        disbursedBy
        blockNumber
        blockTimestamp
      }
      additionalDisbursementToTasks(where: { taskId: $taskId }) {
        id
        taskId
        amount
        remarks
        disbursedBy
        blockNumber
        blockTimestamp
      }
    }
  `,

  getContractState: `
    query GetContractState {
      contractPauseds(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
        id
        by
        blockNumber
        blockTimestamp
      }
      contractUnpauseds(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
        id
        by
        blockNumber
        blockTimestamp
      }
    }
  `,
};

// Factory Queries
export const FactoryQueries = {
  getDeployments: `
    query GetDeployments {
      rewardManagementCreateds(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
        id
        rewardManagement
        aclAddress
        appId
        name
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `,
  getRewardManagementCreatedByAddress: `
  query GetRewardManagementCreatedByAddress($rewardManagement: String!) {
    rewardManagementCreateds(where: { rewardManagement: $rewardManagement }) {
      aclAddress
  
      id
      name
      rewardManagement
    
    }
  }
`,

};


export const ParticipantQueries = {
  getParticipantTasks: `
  query GetParticipantTasks($participant: Bytes!) {
  participantApplieds(where: { participant: $participant }) {
    id
    internal_id
    blockTimestamp
    transactionHash
    taskDetail {
      id
      name
      detailsUrl
      owner
      expiryDate
      rewardToken
      totalRewardAmount
      isOpen
      requireApproval
      isWhitelisted
      isTokenDisbursed
      maxParticipants
      acceptedParticipantCount
      verifiedParticipants
      createdAt
    }
  }
}
  `
};
