import { Client, fetchExchange } from '@urql/core';
import {
  AppRegistryQueries,
  FactoryQueries,

  GetAcceptedParticipantsByTask,

  GetPendingParticipantsByTask,
  getTaskCreatedById,
  getTaskCreation,

  ParticipantQueries,
  RewardManagementQueries,
  TokenQueries
} from '../queries';


const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL!; 

export class SubgraphService {
  private subgraphQuery: Client;

  constructor(graphurl: string) {
    this.subgraphQuery = new Client({
      url: graphurl,
      exchanges: [fetchExchange],
    });
  }

  // AppRegistry Related Services
  async getAppRegistryData() {
    try {
      const appCreated = await this.subgraphQuery.query(AppRegistryQueries.getAppCreated, {});
      const roleManagement = await this.subgraphQuery.query(AppRegistryQueries.getRoleManagement, {});
      return { appCreated: appCreated.data, roleManagement: roleManagement.data };
    } catch (error) {
      console.error('Error fetching AppRegistry data:', error);
      return { error };
    }
  }

  // Token Related Services
  async getTokenData() {
    try {
      const transfers = await this.subgraphQuery.query(TokenQueries.getTransfers, {});
      const approvals = await this.subgraphQuery.query(TokenQueries.getApprovals, {});
      return { transfers: transfers.data, approvals: approvals.data };
    } catch (error) {
      console.error('Error fetching token data:', error);
      return { error };
    }
  }

  // RewardManagement Related Services
  async getAllTasks() {
    
    const { data, error } = await this.subgraphQuery.query(getTaskCreation, {});
    return { data, error };
  }

  async getTaskById(id:string) {
    const { data, error } = await this.subgraphQuery.query(getTaskCreatedById, { id })
    return {data, error }



  }
  
  
async getPendingParticipantsByTask(taskId: string) { 
    try { 

const {data, error} = await this.subgraphQuery.query(
      GetPendingParticipantsByTask,
      { taskId }
    );
      return { data, error };
    } catch (error) {
      console.error('Error fetching task with participant status:', error);
      return { error };


    } 
  






}
  
  async getAcceptedParticipantsByTask(taskId: string) { 
    try { 

const {data, error} = await this.subgraphQuery.query(
      GetAcceptedParticipantsByTask,
      { taskId }
    );
      return { data, error };
    } catch (error) {
      console.error('Error fetching task with participant status:', error);
      return { error };


    } 
  






  }
  // async getTaskManagementData(taskId?: string) {
  //   try {
  //     //const taskCreation = await this.subgraphQuery.query(RewardManagementQueries.getTaskCreation, {});
      
  //     if (taskId) {
  //       const participationStatus = await this.subgraphQuery.query(
  //         RewardManagementQueries.getParticipationStatus, 
  //         { taskId }
  //       );
  //       const whitelistStatus = await this.subgraphQuery.query(
  //         RewardManagementQueries.getWhitelistStatus, 
  //         { taskId }
  //       );
  //       const disbursements = await this.subgraphQuery.query(
  //         RewardManagementQueries.getDisbursements, 
  //         { taskId }
  //       );

  //       return {
  //        // taskCreation: taskCreation.data,
  //         participationStatus: participationStatus.data,
  //         whitelistStatus: whitelistStatus.data,
  //         disbursements: disbursements.data
  //       };
  //     }

  //     return { taskCreation: taskCreation.data };
  //   } catch (error) {
  //     console.error('Error fetching task management data:', error);
  //     return { error };
  //   }
  // }

  async getContractState() {
    try {
      const { data, error } = await this.subgraphQuery.query(
        RewardManagementQueries.getContractState, 
        {}
      );
      return { data, error };
    } catch (error) {
      console.error('Error fetching contract state:', error);
      return { error };
    }
  }

  // Factory Related Services
  async getDeployments() {
    try {
      const { data, error } = await this.subgraphQuery.query(FactoryQueries.getDeployments, {});
      return { data, error };
    } catch (error) {
      console.error('Error fetching deployments:', error);
      return { error };
    }
  }

  async getRewardManagementCreatedByAddress(rewardManagement: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        FactoryQueries.getRewardManagementCreatedByAddress,
        { rewardManagement }
      );
  
      if (error) {
        throw error;
      }
  
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching rewardManagementCreated by address:', error);
      return { data: null, error };
    }
  }

  async getParticipantTasks(participantAddress: string) {
    console.log('Fetching tasks for participant:', participantAddress);
  
    try { 

      const { data, error } = await this.subgraphQuery.query(
      ParticipantQueries.getParticipantTasks, 
      { participant:participantAddress }
      )
      return { data, error}


    } catch (error) { 

       console.error('Error fetching rewardManagementCreated by address:', error);
      return { data: null, error };


    }




}
  

  
}



