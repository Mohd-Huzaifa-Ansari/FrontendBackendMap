

// import React from 'react'

const Delete = () => {
  return (
    <div>Delete</div>
  )
}

export default Delete



// const deleteLayerFeature = (featureId) => {
//     console.log(featureId," on start getting this--featureId")
//     if (outerViewName !== 'Default View') {
//       axios
//         .delete(
//           `${ORDER_URL}${id}/view/${viewId}/layer/${layerId}/layer-data/${featureId}`,
//           data,
//           {
//             headers: {
//               Authorization: `Token ${token}`,
//               Accept: 'application/json',
//             },
//           }
//         )
//         .then((response) => {
//           uploadedLayer.map((layer) => {
//             layer.data = layer.data.filter(
//               (feature) => feature.id != `${featureId}`
//             );
//           });
//           setUploadedLayer([...uploadedLayer]);
//           if (editInteraction) {
//             editLayer(
//               id,
//               olMap,
//               name,
//               type,
//               viewId,
//               layerId,
//               setZoomLayer,
//               uploadedLayer,
//               setUploadedLayer
//             );
//           }
//           console.log(featureId," after delete--featureId")
//           console.log("delte the feature")
//           handleSuccess(TOAST_TYPE.SUCCESS, 'Feature Deleted Successfully!');
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     } else {
//       handleSuccess(
//         TOAST_TYPE.WARNING,
//         'Deleting Feature in Default View is not allowed!'
//       );
//     }
//   };


  // export default deleteLayerFeature;