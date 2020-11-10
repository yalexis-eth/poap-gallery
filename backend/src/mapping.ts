import { BigInt, ens } from "@graphprotocol/graph-ts"
import {
  Contract,
  EventToken,
  Paused,
  Unpaused,
  AdminAdded,
  AdminRemoved,
  EventMinterAdded,
  EventMinterRemoved,
  Transfer,
  Approval,
  ApprovalForAll
} from "../generated/Contract/Contract"
import { PoapToken, PoapEvent, PoapTransfer, PoapOwner } from "../generated/schema"

const burnAddress = '0x0000000000000000000000000000000000000000'

// export function handleEventToken(event: EventToken): void {
//   // Entities can be loaded from the store using a string ID; this ID
//   // needs to be unique across all entities of the same type
//   let token = PoapToken.load(event.params.tokenId.toString())

//   // Entities only exist after they have been saved to the store;
//   // `null` checks allow to create entities on demand
//   if (token == null) {
//     token = new PoapToken(event.params.tokenId.toString())
//     // token fields can be set using simple assignments
//     // token.count = BigInt.fromI32(0)
//   }

//   // check how many tokens are minted by the sender

//   token.eventId = event.params.eventId
//   token.tokenId = event.params.tokenId
//   // token.owner = event.transaction.from.toHex()

//   // When a token gets created also create corresponding event
//   let poapEvent = PoapEvent.load(event.params.eventId.toString())
//   if (poapEvent == null) {
//     poapEvent = new PoapEvent(event.params.eventId.toString())
//     poapEvent.tokenCount = BigInt.fromI32(0)
//     poapEvent.eventId = event.params.eventId
//   }

//   // let exists = false
//   // for (let i = 0; i < poapEvent.tokens.length; i++) {
//   //   if(BigInt(poapEvent.tokens[i]) === event.params.tokenId) {
//   //     exists = true
//   //     break
//   //   }
//   // }

//   // if (!exists) {
//   //   poapEvent.tokens.push(token.tokenId)
//   // }
//   poapEvent.tokenCount = poapEvent.tokenCount + BigInt.fromI32(1)


//   // BigInt and BigDecimal math are supported
//   // token.count = token.count + BigInt.fromI32(1)

//   // token fields can be set based on event parameters


//   // Entities can be written to the store with `.save()`
//   token.save()
//   poapEvent.save()

//   // Note: If a handler doesn't require existing field values, it is faster
//   // _not_ to load the entity from the store. Instead, create it fresh with
//   // `new Entity(...)`, set the fields that should be updated and save the
//   // entity back to the store. Fields that were not set or unset remain
//   // unchanged, allowing for partial updates to be applied.

//   // It is also possible to access smart contracts from mappings. For
//   // example, the contract that has emitted the event can be connected to
//   // with:
//   //
//   // let contract = Contract.bind(event.address)
//   //
//   // The following functions can then be called on this contract to access
//   // state variables and other data:
//   //
//   // - contract.supportsInterface(...)
//   // - contract.getApproved(...)
//   // - contract.totalSupply(...)
//   // - contract.isAdmin(...)
//   // - contract.isEventMinter(...)
//   // - contract.tokenOfOwnerByIndex(...)
//   // - contract.tokenByIndex(...)
//   // - contract.paused(...)
//   // - contract.ownerOf(...)
//   // - contract.balanceOf(...)
//   // - contract.isApprovedForAll(...)
//   // - contract.name(...)
//   // - contract.symbol(...)
//   // - contract.tokenEvent(...)
//   // - contract.tokenDetailsOfOwnerByIndex(...)
//   // - contract.tokenURI(...)
//   // - contract.mintToken(...)
//   // - contract.mintEventToManyUsers(...)
//   // - contract.mintUserToManyEvents(...)
// }

// This event is emitted when a new token is minted
export function handleEventToken(event: EventToken): void {
  // connect the token with its corresponding event
  let poapEvent = PoapEvent.load(event.params.eventId.toString())

  if (poapEvent === null) {
    poapEvent = new PoapEvent(event.params.eventId.toString())
    poapEvent.tokenCount = BigInt.fromI32(0)
    poapEvent.created = event.block.timestamp
  }

  poapEvent.tokenCount += BigInt.fromI32(1)
  poapEvent.save()

  let token = PoapToken.load(event.params.tokenId.toString())
  token.event =  poapEvent.id

  token.save()
}


export function handleTransfer(event: Transfer): void {
  let ownerTo = PoapOwner.load(event.params.to.toHex())
  if(ownerTo === null) {
    ownerTo = new PoapOwner(event.params.to.toHex())
    ownerTo.tokensOwned = BigInt.fromI32(0)
    ownerTo.tokensMinted = BigInt.fromI32(0)
  }
  ownerTo.tokensOwned += BigInt.fromI32(1)
  // ownerTo.ens = ens.nameByHash(event.params.to.toHex())
  ownerTo.tokens
  ownerTo.save()
  
  let ownerFrom = PoapOwner.load(event.params.from.toHex())
  if(ownerFrom === null) {
    ownerFrom = new PoapOwner(event.params.from.toHex())
    ownerFrom.tokensOwned = BigInt.fromI32(0)
    ownerFrom.tokensMinted = BigInt.fromI32(0)
  }
  ownerFrom.tokensOwned -= BigInt.fromI32(1)
  // ownerFrom.ens = ens.nameByHash(event.params.from.toHex())
  ownerFrom.save()
  
  let ownerSender = PoapOwner.load(event.transaction.from.toHex())
  if(ownerSender === null) {
    ownerSender = new PoapOwner(event.transaction.from.toHex())
    ownerSender.tokensOwned = BigInt.fromI32(0)
    ownerSender.tokensMinted = BigInt.fromI32(0)
  }
  ownerSender.tokensMinted += BigInt.fromI32(1)
  // ownerSender.ens = ens.nameByHash(event.transaction.from.toHex())
  ownerSender.save()
  let token = PoapToken.load(event.params.tokenId.toString())

  if (token === null) {
        token = new PoapToken(event.params.tokenId.toString())
        token.transferCount = BigInt.fromI32(0)
        
      // should not have to check this
        token.claimedBy = ownerTo.id
        token.created = event.block.timestamp
  } else {
    token.transferCount += BigInt.fromI32(1)
  }
  token.currentOwner = ownerTo.id
  token.save()

  let transfer = PoapTransfer.load(event.transaction.hash.toHex())
  if (transfer === null) {
    transfer = new PoapTransfer(event.transaction.hash.toHex())
    transfer.from = ownerFrom.id
    transfer.to = ownerTo.id
    transfer.time = event.block.timestamp
    transfer.token = token.id
  }

  transfer.save()
}



export function handlePaused(event: Paused): void {

}

export function handleUnpaused(event: Unpaused): void {

}

export function handleAdminAdded(event: AdminAdded): void {

}

export function handleAdminRemoved(event: AdminRemoved): void {

}

export function handleEventMinterAdded(event: EventMinterAdded): void {

}

export function handleEventMinterRemoved(event: EventMinterRemoved): void {

}

export function handleApproval(event: Approval): void {

}

export function handleApprovalForAll(event: ApprovalForAll): void {

}