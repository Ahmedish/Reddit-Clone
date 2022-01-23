const { Post } = require('../models')

module.exports.test = (req, res, next) => {
  const date = new Date(req.body.date);

  const newPost = new Post({
    author: "Ahmed",
    text: "this is the text!",
    title: "this is the title!",
    createdAt: date.toISOString()
  })

  newPost
    .save()
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })


}

module.exports.index = (req, res, next) => {
  const userDateRange = req.params.dateRange;
  let userCurrDate = new Date(req.query.currDate);

  let oldDate = new Date(req.query.currDate);
  let newDate = new Date(req.query.currDate);


  if (userDateRange !== undefined) {
    switch (userDateRange) {
      case "Past week":
        oldDate.setDate(userCurrDate.getDate() - 7);
        Post.find({ createdAt: { $gte: oldDate, $lte: userCurrDate } })
          .populate('comments')
          .sort('-createdAt')
          .then(posts => {
            res.locals.data = { posts }
            res.locals.status = 200
            return next()
          })
          .catch(err => {
            console.error(err)
            res.locals.error = { error: err.message }
            return next()
          })
        break;
      case "Past month":
        oldDate.setDate(userCurrDate.getDate() - 31);
        Post.find({ createdAt: { $gte: oldDate, $lte: userCurrDate } })
          .populate('comments')
          .sort('-createdAt')
          .then(posts => {
            res.locals.data = { posts }
            res.locals.status = 200
            return next()
          })
          .catch(err => {
            console.error(err)
            res.locals.error = { error: err.message }
            return next()
          })
        break;
      case "Past year":
        oldDate.setDate(userCurrDate.getDate() - 365);
        Post.find({ createdAt: { $gte: oldDate, $lte: userCurrDate } })
          .populate('comments')
          .sort('-createdAt')
          .then(posts => {
            res.locals.data = { posts }
            res.locals.status = 200
            return next()
          })
          .catch(err => {
            console.error(err)
            res.locals.error = { error: err.message }
            return next()
          })
        break;
      case "A year ago":
        oldDate.setDate(userCurrDate.getDate() - 3650);
        newDate.setDate(userCurrDate.getDate() - 365);
        Post.find({ createdAt: { $gte: oldDate, $lte: newDate } })
          .populate('comments')
          .sort('-createdAt')
          .then(posts => {
            res.locals.data = { posts }
            res.locals.status = 200
            return next()
          })
          .catch(err => {
            console.error(err)
            res.locals.error = { error: err.message }
            return next()
          })
        break;
      case "Ancient times":
        let oldestTime = new Date(0);
        newDate.setDate(userCurrDate.getDate() - 3650);
        Post.find({ createdAt: { $gte: oldestTime, $lte: newDate } })
          .populate('comments')
          .sort('-createdAt')
          .then(posts => {
            res.locals.data = { posts }
            res.locals.status = 200
            return next()
          })
          .catch(err => {
            console.error(err)
            res.locals.error = { error: err.message }
            return next()
          })
        break;
    }
  } else {
    Post.find()
      .populate('comments')
      .sort('-createdAt')
      .then(posts => {
        res.locals.data = { posts }
        res.locals.status = 200
        return next()
      })
      .catch(err => {
        console.error(err)
        res.locals.error = { error: err.message }
        return next()
      })
  }
}

module.exports.get = (req, res, next) => {
  Post.findById(req.params.id)
    .populate('comments')
    .then(post => {
      res.locals.data = { post }
      res.locals.status = post === null ? 404 : 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.errors = { error: err.message }
      return next()
    })
}

module.exports.store = (req, res, next) => {
  const newPost = new Post(req.body)
  newPost
    .save()
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.update = (req, res, next) => {
  Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
    runValidators: true,
    new: true,
  })
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.delete = (req, res, next) => {
  Post.findByIdAndCascadeDelete({ _id: req.params.id })
    .then(_ => {
      res.locals.data = { deleted: 'Success' }
      res.locals.status = 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.comment = (req, res, next) => {
  Post.findByIdAndAddComment(req.params.id, req.body)
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}
