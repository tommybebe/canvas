'use strict';

var _id = 1000,
  newId = function(){
    return _id++;
  };

/**
 * Get awesome things
 */
module.exports = function(req, res) {
  res.json({
    id: 1,
    title: 'My Canvas',
    author: 2,
    createdAt: "2014-05-29T06:22:13Z",
    updatedAt: "2014-05-29T06:22:13Z",
    items: [
      {
        id: newId(),
        area: 'customerSegments',
        order: 1,
        content: 'Startup Founders',
        createdAt: "2014-05-29T06:22:13Z",
        updatedAt: "2014-05-29T06:22:13Z"
      },
      {
        id: newId(),
        area: 'earlyAdopters',
        order: 1,
        content: 'Book reader',
        createdAt: "2014-05-29T06:22:13Z",
        updatedAt: "2014-05-29T06:22:13Z"
      },
      {
        id: newId(),
        area: 'problem',
        order: 1,
        content: 'Business Models needs to be more portable',
        createdAt: "2014-05-29T06:22:13Z",
        updatedAt: "2014-05-29T06:22:13Z"
      },
      {
        id: newId(),
        area: 'existingAlternatives',
        order: 1,
        content: 'intuition',
        createdAt: "2014-05-29T06:22:13Z",
        updatedAt: "2014-05-29T06:22:13Z"
      },
      {
        id: newId(),
        area: 'uniqueValueProposition',
        order: 1,
        content: 'Helps startsups raise thier odds of success',
        createdAt: "2014-05-29T06:22:13Z",
        updatedAt: "2014-05-29T06:22:13Z"
      },
      {
        id: newId(),
        area: 'highLevelConcept',
        order: 1,
        content: 'Startsup Reports Card',
        createdAt: "2014-05-29T06:22:13Z",
        updatedAt: "2014-05-29T06:22:13Z"
      },
      {
        id: newId(),
        area: 'solution',
        order: 1,
        content: '1-page Lean Canvas',
        createdAt: "2014-05-29T06:22:13Z",
        updatedAt: "2014-05-29T06:22:13Z"
      },
      {
        id: newId(),
        area: 'channels',
        order: 1,
        content: 'Blog',
        createdAt: "2014-05-29T06:22:13Z",
        updatedAt: "2014-05-29T06:22:13Z"
      },
      {
        id: newId(),
        area: 'revenueStreams',
        order: 1,
        content: '$12/mo',
        createdAt: "2014-05-29T06:22:13Z",
        updatedAt: "2014-05-29T06:22:13Z"
      },
      {
        id: newId(),
        area: 'costStructure',
        order: 1,
        content: 'Hosting Costs',
        createdAt: "2014-05-29T06:22:13Z",
        updatedAt: "2014-05-29T06:22:13Z"
      },
      {
        id: newId(),
        area: 'keyMetrics',
        order: 1,
        content: 'Create Canvas',
        createdAt: "2014-05-29T06:22:13Z",
        updatedAt: "2014-05-29T06:22:13Z"
      },
      {
        id: newId(),
        area: 'unfairAdvantage',
        order: 1,
        content: '"Expert" Endorsements',
        createdAt: "2014-05-29T06:22:13Z",
        updatedAt: "2014-05-29T06:22:13Z"
      }
    ]
  });
};