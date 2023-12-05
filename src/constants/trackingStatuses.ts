const trackingStatuses = {
  Printed: 'Printed',
  Dispatched: 'Dispatched',
  InTransit: 'InTransit',
  OutForDelivery: 'OutForDelivery',
  Delivered: 'Delivered',
  PickupInStore: 'PickupInStore',
  AttemptedDelivery: 'AttemptedDelivery',
  Exception: 'Exception',
  AwaitingCollection: 'AwaitingCollection',
  Cancelled: 'Cancelled',
} as const;

export default trackingStatuses;
