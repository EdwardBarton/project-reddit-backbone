
// *************************** MODELS *************************** //

const PostModel = Backbone.Model.extend({
  defaults() {
    return {
      user: '',
      text: '',
      comments: new CommentCollection()
    };
  },

  addComment(user, text) {
    const commentModel = new CommentModel({user: user, text: text});
    this.get('comments').add(commentModel);
  }
});

const CommentModel = Backbone.Model.extend({
  defaults() {
    return {
      user: '',
      text: ''
    };
  }
});

// *************************** COLLECTIONS *************************** //

const CommentCollection = Backbone.Collection.extend({
  model: CommentModel
});

// *************************** VIEWS *************************** //

const PostView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model.get('comments'), 'add', this.renderComments);

  },

  template: Handlebars.compile($('#post-template').html()),
  className: 'post',

  render() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  events: {
    "click .remove-post": "removePost",
    "click .add-comment": "addComment",
    "click .toggle-comments": "toggleComments"
  },

  removePost: function(e) {
    e.preventDefault();

    this.model.destroy();
    this.remove();
  },

  addComment: function(e) {
    e.preventDefault();

    const commentUser = $('#comment-user').val();
    const commentText = $('#comment-text').val();
    this.model.addComment(commentUser, commentText);
  },

  renderComments: function() {
    $('.comments').empty();
    this.model.get('comments').models.forEach(model => {
      const commentView = new CommentView({model: model});
      $('.comments').append(commentView.render().el);
    });
  },

  toggleComments: function(e) {
    e.preventDefault();


  }
});

const CommentView = Backbone.View.extend({
  template: Handlebars.compile($('#comment-template').html()),
  className: 'comment',

  render() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  events: {
    "click .remove-comment": "removeComment"
  },

  removeComment: function(e) {
    e.preventDefault();

    this.model.destroy();
    this.remove();
  }
});


// *************************** EVENTS *************************** //

let postModel, postView;
$('.add-post').on('click', function (e) {
  e.preventDefault();

  const user = $('#post-user').val();
  const text = $('#post-text').val();

  postModel = new PostModel({ text: text, user: user });
  postView = new PostView({ model: postModel });

  $('#post-user').val('').focus();
  $('#post-text').val('');

  $('.posts').append(postView.render().el)
});
