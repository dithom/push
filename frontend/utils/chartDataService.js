function createDataOject(
  accomplishedActivities,
  remainingActivities,
  username
) {
  return {
    labels: [username],
    datasets: [
      {
        label: 'Data One',
        backgroundColor: '#f87979',
        data: [accomplishedActivities, remainingActivities],
      },
    ],
  };
}

export default createDataOject;
