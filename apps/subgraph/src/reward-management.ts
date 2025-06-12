import { log } from "@graphprotocol/graph-ts"
import {
  AdditionalDisbursementToTask,
  ContractPaused,
  ContractUnpaused,
  DisbursementToTask,
  EtherWithdrawn,
  ParticipantApplied,
  ParticipantRemovedFromWhitelist,
  ParticipantWhitelisted,
  RewardManagementCreated,
  TaskAccepted,
  TaskApproved,
  TaskClosed,
  TaskCompleted,
  TaskCreated,
  TaskDetailsUpdated,
  TaskIdMapping,
  TaskVerified,
  TokenTransferred
} from "../generated/schema"
import {
  AdditionalDisbursementToTask as AdditionalDisbursementToTaskEvent,
  ContractPaused as ContractPausedEvent,
  ContractUnpaused as ContractUnpausedEvent,
  DisbursementToTask as DisbursementToTaskEvent,
  EtherWithdrawn as EtherWithdrawnEvent,
  ParticipantApplied as ParticipantAppliedEvent,
  ParticipantRemovedFromWhitelist as ParticipantRemovedFromWhitelistEvent,
  ParticipantWhitelisted as ParticipantWhitelistedEvent,
  TaskAccepted as TaskAcceptedEvent,
  TaskApproved as TaskApprovedEvent,
  TaskClosed as TaskClosedEvent,
  TaskCompleted as TaskCompletedEvent,
  TaskCreated as TaskCreatedEvent,
  TaskDetailsUpdated as TaskDetailsUpdatedEvent,
  TaskVerified as TaskVerifiedEvent,
  TokenTransferred as TokenTransferredEvent,
} from "../generated/templates/RewardManagement/RewardManagement"
import { fetchTaskDetails, updateParticipantTaskStatus } from "./utils"

export function handleAdditionalDisbursementToTask(
  event: AdditionalDisbursementToTaskEvent,
): void {
  let entity = new AdditionalDisbursementToTask(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.taskId = event.params.taskId
  entity.amount = event.params.amount
  entity.remarks = event.params.remarks
  entity.disbursedBy = event.params.disbursedBy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContractPaused(event: ContractPausedEvent): void {
  let entity = new ContractPaused(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContractUnpaused(event: ContractUnpausedEvent): void {
  let entity = new ContractUnpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDisbursementToTask(event: DisbursementToTaskEvent): void {
  let entity = new DisbursementToTask(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.taskId = event.params.taskId
  entity.amount = event.params.amount
  entity.disbursedBy = event.params.disbursedBy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEtherWithdrawn(event: EtherWithdrawnEvent): void {
  let entity = new EtherWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleParticipantApplied(event: ParticipantAppliedEvent): void {
  let entity = new ParticipantApplied(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id
  entity.participant = event.params.participant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // Create TaskDetail entity first
  let taskDetail = fetchTaskDetails(event.params.id, event.address);
  entity.taskDetail = taskDetail.id;
  

  entity.save()

    updateParticipantTaskStatus(
    event.params.participant, 
    event.params.id, 
    'PENDING', 
    event.block.number, 
    event.block.timestamp, 
    taskDetail ? taskDetail.id : null
  );
}

export function handleParticipantRemovedFromWhitelist(
  event: ParticipantRemovedFromWhitelistEvent,
): void {
  let entity = new ParticipantRemovedFromWhitelist(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.taskId = event.params.taskId
  entity.participant = event.params.participant
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleParticipantWhitelisted(
  event: ParticipantWhitelistedEvent,
): void {
  let entity = new ParticipantWhitelisted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.taskId = event.params.taskId
  entity.participant = event.params.participant
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskAccepted(event: TaskAcceptedEvent): void {
  let entity = new TaskAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id
  entity.participant = event.params.participant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
   // Create TaskDetail entity first
  let taskDetail = fetchTaskDetails(event.params.id, event.address);
  entity.taskDetail = taskDetail.id;

  entity.save()

    updateParticipantTaskStatus(
    event.params.participant, 
    event.params.id, 
    'ACCEPTED', 
    event.block.number, 
    event.block.timestamp, 
    taskDetail ? taskDetail.id : null
  );
}

export function handleTaskApproved(event: TaskApprovedEvent): void {
  let entity = new TaskApproved(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id
  entity.approver = event.params.approver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskClosed(event: TaskClosedEvent): void {
  let entity = new TaskClosed(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id
  entity.closedBy = event.params.closedBy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskCompleted(event: TaskCompletedEvent): void {
  let entity = new TaskCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id
  entity.participant = event.params.participant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

   // Create TaskDetail entity first
  let taskDetail = fetchTaskDetails(event.params.id, event.address);
  entity.taskDetail = taskDetail.id;
  // taskDetail.createdAt = event.block.timestamp;
  // taskDetail.task = entity.id; 
  // taskDetail.save();


  entity.save()
   updateParticipantTaskStatus(
    event.params.participant, 
    event.params.id, 
    'COMPLETED', 
    event.block.number, 
    event.block.timestamp, 
    taskDetail ? taskDetail.id : null
  );
  
}

export function handleTaskCreated(event: TaskCreatedEvent): void {
 

  // Create TaskCreated entity
  let entityId = event.transaction.hash.concatI32(event.logIndex.toI32());
  const entity = new TaskCreated(
   entityId
  );

  // Get or create RewardManagementCreated entity
  let rewardManagement = RewardManagementCreated.load(event.address);
 
  


if (rewardManagement) {
    
  entity.rewardManagement = rewardManagement.id
      log.info("RewardManagementCreated found for address: {}", [event.address.toHexString()]);
  } else {
     log.error("No RewardManagementCreated found for address: {}", [event.address.toHexString()]);
}
  
   // Create TaskDetail entity first
  let taskDetail = fetchTaskDetails(event.params.id, event.address);
  taskDetail.createdAt = event.block.timestamp;
  taskDetail.task = entity.id; 
  taskDetail.save();

  
let mapping = new TaskIdMapping(event.params.id)
  mapping.taskCreated = entity.id;
  mapping.save();

  
  entity.internal_id = event.params.id;
  entity.taskDetail = taskDetail.id;
  entity.createdBy = event.params.createdBy;
 
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTaskDetailsUpdated(event: TaskDetailsUpdatedEvent): void {
  let entity = new TaskDetailsUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id
  entity.updatedBy = event.params.updatedBy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskVerified(event: TaskVerifiedEvent): void {
  let entity = new TaskVerified(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id
  entity.participant = event.params.participant
  entity.verifier = event.params.verifier

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenTransferred(event: TokenTransferredEvent): void {
  let entity = new TokenTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.token = event.params.token
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.remarks = event.params.remarks
  entity.transferredBy = event.params.transferredBy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
