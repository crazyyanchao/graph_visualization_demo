//调用画图方法
function init(element, option) {
  return new neo4jD3(element, option);
}

function neo4jD3(_selector, _options) {
  /**
   * 颜色集合
   */
  this.colors = function () {
    // d3.schemeCategory10,
    // d3.schemeCategory20,
    return [
      "#fcea7e", // light yellow
      "#f2baf6", // purple
      "#6dce9e", // green #1
      "#ff928c", // light red
      "#faafc2", // light pink
      "#68bdf6", // light blue
      "#ffc766", // light orange
      "#405f9e", // navy blue
      "#a5abb6", // dark gray
      "#78cecb", // green #2,
      "#b88cbb", // dark purple
      "#ced2d9", // light gray
      "#e84646", // dark red
      "#fa5f86", // dark pink
      "#ffab1a", // dark orange
      "#fcda19", // dark yellow
      "#797b80", // black
      "#c9d96f", // pistacchio
      "#47991f", // green #3
      "#70edee", // turquoise
      "#ff75ea" // pink
    ];
  };
  // 成员属性
  this.container = undefined; // 容器
  this.graph = undefined; // 图
  this.info = undefined; // 信息
  this.node = undefined; // 节点标签array
  this.circle = undefined; // 信息圆饼
  this.nodes = undefined; // 节点 数据jsonarray
  this.relationship = undefined; // 关系标签array
  this.relationshipOutline = undefined; // 关系外线
  this.relationshipOverlay = undefined; // 关系覆盖
  this.relationshipText = undefined; // 关系文字
  this.relationships = undefined; // 关系 数据jsonarray
  this.select_appoint_nodes = []; // 双击节点（节点列表下人/地/事/物/组织）选择的节点 初始化数组
  this.select_nodes = []; // 双击节点（关系列表下）选择的节点 初始化数组
  this.select_query_appoint_nodes = []; // 节点查询（节点列表下人/地/事/物/组织）选择的节点 初始化数组
  this.select_pointing_nodes = []; // 节点查询 选择的关系指向
  this.start_end_nodes = []; // 节点查询 选择的开始节点/结束节点

  this.labels_tree_data = []; // 存储最底层标签数数据
  this.depth = ""; // 点击深度推理的层数存储
  this.search_nodes = []; // 搜索回来的数据
  this.select_mark = []; // 记录刷新前的列表
  this.select_many_arr = []; // 记录多选（选择）的节点
  this.select_analysis_arr = []; // 记录多选（选择）的节点
  this.double_click_obj = {}; // 记录当前双击的节点
  this.back_arr = []; // 后退集合数组
  this.forward_arr = []; // 前进集合数组
  this.checkbox_node_arr = []; // 定向扩展选择的节点集合
  this.checkbox_rela_arr = []; // 定向扩展选择的关系集合
  this.checkbox_node_tactics = []; // 战法扩展选择的节点集合
  this.checkbox_rela_tactics = []; // 战法扩展选择的条件集合
  this.selector = undefined; // 选择者
  this.simulation = undefined; // 力量布局
  this.svg = undefined; // svg
  this.svgNodes = undefined; // svg 节点根标签 g
  this.svgRelationships = undefined; // svg关系根标签 g
  this.svgScale = undefined; // svg规模
  this.svgTranslate = undefined; // svg翻译
  (this.classes2colors = {}), // 类to颜色
  (this.count = 0); // 标记操作次数
  (this.justLoaded = false), // 单纯读取
  (this.numClasses = 0), // 字母类
  (this.options = {
    arrowSize: 4, // 箭头尺寸
    colors: this.colors(), // 颜色
    highlight: undefined, // 高亮
    // iconMap: this.fontAwesomeIcons(), //图标集合
    // icons: undefined, //图标
    imageMap: {}, // 图片集合
    images: undefined, // 图片s
    infoPanel: true, // 信息面板
    minCollision: undefined, // 最小碰撞
    neo4jData: undefined, // 数据
    neo4jDataUrl: undefined, // 数据url
    nodeOutlineFillColor: undefined, // 节点外部填充颜色
    nodeRadius: 25, // 节点半径
    relationshipColor: "#a5abb6", // 关系颜色
    zoomFit: true,// 变焦适合
    linkColor:"red", //线颜色
    linkWidth:2, //线宽
    linkTextColor:"red", //线文字颜色
    linkTextSize:2, //线文字大小
    nodeTextColor:"red", //节点文字颜色
    nodeTextSize:20 //节点文字大小
  }),
  // 笔刷相关参数
  (this.gBrush = null); // 笔刷容器div
  this.brushMode = false; // 笔刷模式
  this.brushing = false; // 笔刷状态
  this.shiftKey = false; // 是否按shift
  this.authorityIds = [];
  this.VERSION = "0.0.1"; // 版本号
  this.rel = {};
  // 成员方法
  /**
   * 初始化图标
   */
  this.initIconMap = function () {
    var option = this.options.iconMap;
    Object.keys(option).forEach(function (key, index) {
      var keys = key.split(","),
        value = option[key];
      keys.forEach(function (key) {
        option[key] = value;
      });
    });
  };
  /**
   * 初始化配置
   *
   * @param {*}
   *            target
   * @param {*}
   *            source
   */
  this.merge = function (target, source) {
    Object.keys(source).forEach(function (property) {
      target[property] = source[property];
    });
  };
  /**
   * 初始化图片
   */
  this.initImageMap = function () {
    var key, keys, selector;

    for (key in this.options.images) {
      if (this.options.images.hasOwnProperty(key)) {
        keys = key.split("|");

        if (!this.options.imageMap[keys[0]]) {
          this.options.imageMap[keys[0]] = [key];
        } else {
          this.options.imageMap[keys[0]].push(key);
        }
      }
    }
  };
  /**
   * 添加信息框
   *
   * @param {*}
   *            container
   */
  this.appendInfoPanel = function (container) {
    return container.append("div").attr("class", "neo4jd3-info");
  };
  /**
   * 添加图形
   *
   * @param {*}
   *            container
   */
  this.appendGraph = function (container) {
    var that = this;
    this.svg = container
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("class", "neo4jd3-graph")
      .call(
        d3.zoom().on("zoom", function () {
          // 设置鼠标缩放
          var scale = d3.event.transform.k,
            translate = [d3.event.transform.x, d3.event.transform.y];
          // if (that.svgTranslate) {
          // translate[0] += that.svgTranslate[0];
          // translate[1] += that.svgTranslate[1];
          // }
          // if (that.svgScale) {
          // scale *= that.svgScale;
          // }
          that.svg.attr(
            "transform",
            "translate(" +
            translate[0] +
            ", " +
            translate[1] +
            ") scale(" +
            scale +
            ")"
          );
          // that.svg.attr('transform', d3.event.transform);
        })
      )
      .on("dblclick.zoom", null) // 取消双击缩放
      .on("click", function () {
        // svg绘图空间点击事件
        // 取消 单选和多选
        if (
          that.node &&
          that.node._groups &&
          that.node._groups[0] &&
          that.node._groups[0].length > 0
        ) {
          that.node.each(function (d) {
            d.multiSelected = false;
            d.previouslySelected = false;
          });
          // if(!that.circle){
          // that.node.classed("selected", false);
          // }
          that.node.classed("multiSelected", false);
        }
      })
      .append("g")
      .attr("width", "100%")
      .attr("height", "100%");

    this.svgRelationships = this.svg.append("g").attr("class", "relationships");

    this.svgNodes = this.svg.append("g").attr("class", "nodes");


    // 增加箭头
    this.svg.append("svg:defs")
      .append("svg:marker")
      .attr("id", "marker")
      .attr('viewBox', '0 -5 10 10')
      .attr("refX", 22) // 箭头离间段起始点的距离 距离决定节点的半径
      .attr("refY", 0)
      .attr('markerWidth', 10) // 箭头大小
      .attr('markerHeight', 10)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr("fill", "#128EB9");
    // 键盘监听事件 开始
    /**
     * 笔刷开始
     */
    that.brushstarted = function () {
      that.brushing = true; // 开始笔刷
      if (that.node) {
        that.node.each(function (d) {
          d.previouslySelected = d.multiSelected;
        });
      }
    };
    /**
     * 笔刷选中效果
     */
    that.brushed = function () {
      if (!d3.event.sourceEvent) return;
      if (!d3.event.selection) return;

      var extent = d3.event.selection;
      if (that.node) {
        that.node.classed("multiSelected", function (d) {
          // 返回是 1 则为范围内
          if (
            (d.previouslySelected ^
              (extent[0][0] <= d.x &&
                d.x < extent[1][0] &&
                extent[0][1] <= d.y &&
                d.y < extent[1][1])) ===
            1
          ) {
            d.multiSelected = true;
          } else {
            d.multiSelected = false;
          }
          return (
            d.previouslySelected ^
            (extent[0][0] <= d.x &&
              d.x < extent[1][0] &&
              extent[0][1] <= d.y &&
              d.y < extent[1][1])
          );
        });
      }
    };
    /**
     * 笔刷结束
     */
    that.brushended = function () {
      if (!d3.event.sourceEvent) return;
      // 没有笔刷选中区域
      if (!d3.event.selection) return;
      // 没有笔刷容器
      if (!that.gBrush) return;

      that.gBrush.call(that.brush.move, null);

      var brushOn = $(".d3_kx_btn").hasClass("activeSix");
      if (!brushOn) {
        // 不是笔刷模式时
        if (!that.brushMode) {
          that.gBrush.remove();
          that.gBrush = null;
        }
        // 笔刷状态结束
        that.brushing = false;
        // shift 取消
        // 笔刷模式关闭
        that.brushMode = false;

        // 笔刷状态
        if (!that.brushing) {
          // 笔刷结束后 移除笔刷图层 同时 初始化笔刷
          that.gBrush.remove();
          that.gBrush = null;
        }
      }
    };
    /**
     * 创建笔刷
     */
    that.brush = d3
      .brush()
      .on("start", that.brushstarted)
      .on("brush", that.brushed)
      .on("end", that.brushended);
    /**
     * 监听键盘按下
     */
    that.keydown = function (d) {
      // 判断是否开启了笔刷
      var brushOn = $(".d3_kx_btn").hasClass("activeSix");
      if (brushOn) {
        // 如果有了笔刷容器 则返回
        if (that.gBrush) return;
        // 笔刷模式 开启
        that.brushMode = true;
        // 如果没有笔刷容器 则创建 同时添加笔刷事件
        if (!that.gBrush) {
          that.gBrush = that.svg.append("g");
          that.gBrush.call(that.brush);
        }
      } else {
        // 笔刷状态结束
        that.brushing = false;
        // shift 取消
        // 笔刷模式关闭
        that.brushMode = false;

        // 笔刷状态
        if (!that.brushing) {
          // 笔刷结束后 移除笔刷图层 同时 初始化笔刷
          that.gBrush.remove();
          that.gBrush = null;
        }
      }
    };
    /**
     * 监听键盘拿起
     */
    that.keyup = function () {
      if (that.shiftKey) {
        // shift 取消
        that.shiftKey = false;
        // 笔刷模式关闭
        that.brushMode = false;
        // 如果 没有笔刷容器 则直接返回
        if (!that.gBrush) return;
        // 笔刷状态
        if (!that.brushing) {
          // 笔刷结束后 移除笔刷图层 同时 初始化笔刷
          that.gBrush.remove();
          that.gBrush = null;
        }
      }
    };
    // 添加 按键监听 事件
    // d3.select('body').on('keydown', that.keydown)//按下shift 执行框选
    // d3.select('body').on('keyup', that.keyup)

    // 键盘监听事件结束
  };
  /**
   * 初始化力导布局
   */
  this.initSimulation = function () {
    var that = this;
    var clientWidth = this.svg.node() ?
      this.svg.node().parentElement.parentElement.clientWidth :
      window.screen.availHeight;
    var clientHeight = this.svg.node() ?
      this.svg.node().parentElement.parentElement.clientHeight :
      window.screen.availWidth;
    var simulation = d3
      .forceSimulation()
      .force(
        "collide",
        d3
        .forceCollide()
        .radius(function (d) {
          return that.options.minCollision;
        })
        .iterations(0.8)
      )
      .force("charge", d3.forceManyBody().distanceMin(20).strength(0.1))
      .force(
        "link",
        d3
        .forceLink()
        .id(function (d) {
          return d.id;
        })
        .distance(function (d) {
          if (d.type == "虚拟账号" || d.type == "隶属虚拟账号") return 0;
          return 250;
        })
      )
      // 设置中心点
      .force("center", d3.forceCenter(clientWidth / 3, clientHeight / 3)) // 设置图形居中
      .on("tick", function () {
        that.tick(); // 秒监测
      })
      .on("end", function () {
        /* 改成点击适应变焦 */
        // if (that.options.zoomFit && !that.justLoaded) {
        // that.justLoaded = true;
        // that.zoomFit(2); //变焦适合
        // }
      });
    // 添加节点 将状态改为解锁状态
    if (
      $(".unlockCstyle")
      .find("i")
      .hasClass("lock")
    ) {
      $(".unlockCstyle")
        .find("i")
        .removeClass("lock");
    }
    return simulation;
  };
  /**
   * 布局 实时监测方法
   */
  this.tick = function () {
    this.tickNodes(); // 实时节点监测
    this.tickRelationships(); // 实时关系监测
    this.tickCircle(); // 实时监测圆饼位置
  };
  /**
   * 监测节点
   */
  this.tickNodes = function () {
    if (this.node) {
      this.node.attr("transform", function (d) {
        return "translate(" + d.x + ", " + d.y + ")";
      });
    }
  };
  /**
   * 监测节点
   */
  this.tickCircle = function () {
    if (this.circle) {
      if (this.nodes) {
        var node = this.nodes.filter(function (d) {
          return d.selected;
        });
        if (node[0] && node[0].x && node[0].y) {
          this.circle.attr("transform", function (d) {
            return "translate(" + node[0].x + ", " + node[0].y + ")";
          });
        }
      }
    }
  };
  /**
   * 监测关系线
   */
  this.tickRelationships = function () {
    var that = this;
    if (this.relationship) {
      //      this.relationship.attr("transform", function(d) {
      //        var angle = that.rotation(d.source, d.target);
      //        return (
      //          "translate(" +
      //          d.source.x +
      //          ", " +
      //          d.source.y +
      //          ") rotate(" +
      //          angle +
      //          ")"
      //        );
      //      });
      //
      //      this.tickRelationshipsTexts(); // 监测关系文字
      //      this.tickRelationshipsOutlines(); // 监测关系外部线
      // this.tickRelationshipsOverlays(); //监测关系布局
      this.relationshipLines(); //监测弧线
    }
  };
  /**
   * 监测弧线
   */
  this.relationshipLines = function () {
    var that = this;
    this.relationshipOutline.attr("d", that.positionLink)
  }
  /**
   * 弧线监测
   */
  this.positionLink = function (d) {
    //如果连接线连接的是同一个实体，则对path属性进行调整，绘制的圆弧属于长圆弧，同时对终点坐标进行微调，避免因坐标一致导致弧无法绘制
    if (d.target == d.source) {
      dr = 30 / d.linknum;
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 1,1 " + d.target.x +
        "," + (d.target.y + 1);
    } else if (d.size % 2 != 0 && d.linknum == 1) { //如果两个节点之间的连接线数量为奇数条，则设置编号为1的连接线为直线，其他连接线会均分在两边
      return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
    }
    //根据连接线编号值来动态确定该条椭圆弧线的长半轴和短半轴，当两者一致时绘制的是圆弧
    //注意A属性后面的参数，前两个为长半轴和短半轴，第三个默认为0，第四个表示弧度大于180度则为1，小于则为0，这在绘制连接到相同节点的连接线时用到；第五个参数，0表示正角，1表示负角，即用来控制弧形凹凸的方向。本文正是结合编号的正负情况来控制该条连接线的凹凸方向，从而达到连接线对称的效果
    var curve = 1.5;
    var homogeneous = 1.2;
    var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy) * (d.linknum + homogeneous) / (curve * homogeneous);
    //当节点编号为负数时，对弧形进行反向凹凸，达到对称效果
    if (d.linknum < 0) {
      dr = Math.sqrt(dx * dx + dy * dy) * (-1 * d.linknum + homogeneous) / (curve * homogeneous);
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,0 " + d.target.x +
        "," + d.target.y;
    }
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," +
      d.target.y;
  }
  /**
   * 旋转
   *
   * @param {*}
   *            source
   * @param {*}
   *            target
   */
  this.rotation = function (source, target) {
    return (
      (Math.atan2(target.y - source.y, target.x - source.x) * 180) / Math.PI
    );
  };
  /**
   * 关系文字监测
   */
  this.tickRelationshipsTexts = function () {
    var that = this;
    this.relationshipText.attr("transform", function (d) {
      var angle = (that.rotation(d.source, d.target) + 360) % 360,
        mirror = angle > 90 && angle < 270,
        center = {
          x: 0,
          y: 0
        },
        n = that.unitaryNormalVector(d.source, d.target),
        nWeight = mirror ? 2 : -3,
        point = {
          x: (d.target.x - d.source.x) * 0.5 + n.x * nWeight,
          y: (d.target.y - d.source.y) * 0.5 + n.y * nWeight
        },
        rotatedPoint = that.rotatePoint(center, point, angle);

      return (
        "translate(" +
        rotatedPoint.x +
        ", " +
        rotatedPoint.y +
        ") rotate(" +
        (mirror ? 180 : 0) +
        ")"
      );
    });
  };
  /**
   * 关系外部线监测
   */
  this.tickRelationshipsOutlines = function () {
    var that = this;
    this.relationship.each(function (relationship) {
      var rel = d3.select(this),
        outline = rel.select(".outline"),
        text = rel.select(".text"),
        bbox = text.node().getBBox(),
        padding = 3;

      outline.attr("d", function (d) {
        var center = {
            x: 0,
            y: 0
          },
          angle = that.rotation(d.source, d.target),
          textBoundingBox = text.node().getBBox(),
          textPadding = 5,
          u = that.unitaryVector(d.source, d.target),
          textMargin = {
            x: (d.target.x -
                d.source.x -
                (textBoundingBox.width + textPadding) * u.x) *
              0.5,
            y: (d.target.y -
                d.source.y -
                (textBoundingBox.width + textPadding) * u.y) *
              0.5
          },
          n = that.unitaryNormalVector(d.source, d.target),
          rotatedPointA1 = that.rotatePoint(
            center, {
              x: 0 + (that.options.nodeRadius + 1) * u.x - n.x,
              y: 0 + (that.options.nodeRadius + 1) * u.y - n.y
            },
            angle
          ),
          rotatedPointB1 = that.rotatePoint(
            center, {
              x: textMargin.x - n.x,
              y: textMargin.y - n.y
            },
            angle
          ),
          rotatedPointC1 = that.rotatePoint(
            center, {
              x: textMargin.x,
              y: textMargin.y
            },
            angle
          ),
          rotatedPointD1 = that.rotatePoint(
            center, {
              x: 0 + (that.options.nodeRadius + 1) * u.x,
              y: 0 + (that.options.nodeRadius + 1) * u.y
            },
            angle
          ),
          rotatedPointA2 = that.rotatePoint(
            center, {
              x: d.target.x - d.source.x - textMargin.x - n.x,
              y: d.target.y - d.source.y - textMargin.y - n.y
            },
            angle
          ),
          rotatedPointB2 = that.rotatePoint(
            center, {
              x: d.target.x -
                d.source.x -
                (that.options.nodeRadius + 1) * u.x -
                n.x -
                u.x * that.options.arrowSize,
              y: d.target.y -
                d.source.y -
                (that.options.nodeRadius + 1) * u.y -
                n.y -
                u.y * that.options.arrowSize
            },
            angle
          ),
          rotatedPointC2 = that.rotatePoint(
            center, {
              x: d.target.x -
                d.source.x -
                (that.options.nodeRadius + 1) * u.x -
                n.x +
                (n.x - u.x) * that.options.arrowSize,
              y: d.target.y -
                d.source.y -
                (that.options.nodeRadius + 1) * u.y -
                n.y +
                (n.y - u.y) * that.options.arrowSize
            },
            angle
          ),
          rotatedPointD2 = that.rotatePoint(
            center, {
              x: d.target.x - d.source.x - (that.options.nodeRadius + 1) * u.x,
              y: d.target.y - d.source.y - (that.options.nodeRadius + 1) * u.y
            },
            angle
          ),
          rotatedPointE2 = that.rotatePoint(
            center, {
              x: d.target.x -
                d.source.x -
                (that.options.nodeRadius + 1) * u.x +
                (-n.x - u.x) * that.options.arrowSize,
              y: d.target.y -
                d.source.y -
                (that.options.nodeRadius + 1) * u.y +
                (-n.y - u.y) * that.options.arrowSize
            },
            angle
          ),
          rotatedPointF2 = that.rotatePoint(
            center, {
              x: d.target.x -
                d.source.x -
                (that.options.nodeRadius + 1) * u.x -
                u.x * that.options.arrowSize,
              y: d.target.y -
                d.source.y -
                (that.options.nodeRadius + 1) * u.y -
                u.y * that.options.arrowSize
            },
            angle
          ),
          rotatedPointG2 = that.rotatePoint(
            center, {
              x: d.target.x - d.source.x - textMargin.x,
              y: d.target.y - d.source.y - textMargin.y
            },
            angle
          );

        return (
          "M " +
          rotatedPointA1.x +
          " " +
          rotatedPointA1.y +
          " L " +
          rotatedPointB1.x +
          " " +
          rotatedPointB1.y +
          " L " +
          rotatedPointC1.x +
          " " +
          rotatedPointC1.y +
          " L " +
          rotatedPointD1.x +
          " " +
          rotatedPointD1.y +
          " Z M " +
          rotatedPointA2.x +
          " " +
          rotatedPointA2.y +
          " L " +
          rotatedPointB2.x +
          " " +
          rotatedPointB2.y +
          " L " +
          rotatedPointC2.x +
          " " +
          rotatedPointC2.y +
          " L " +
          rotatedPointD2.x +
          " " +
          rotatedPointD2.y +
          " L " +
          rotatedPointE2.x +
          " " +
          rotatedPointE2.y +
          " L " +
          rotatedPointF2.x +
          " " +
          rotatedPointF2.y +
          " L " +
          rotatedPointG2.x +
          " " +
          rotatedPointG2.y +
          " Z"
        );
      });
    });
  };
  /**
   * 关系线覆盖
   */
  this.tickRelationshipsOverlays = function () {
    var that = this;
    this.relationshipOverlay.attr("d", function (d) {
      var center = {
          x: 0,
          y: 0
        },
        angle = that.rotation(d.source, d.target),
        n1 = that.unitaryNormalVector(d.source, d.target),
        n = that.unitaryNormalVector(d.source, d.target, 50),
        rotatedPointA = that.rotatePoint(
          center, {
            x: 0 - n.x,
            y: 0 - n.y
          },
          angle
        ),
        rotatedPointB = that.rotatePoint(
          center, {
            x: d.target.x - d.source.x - n.x,
            y: d.target.y - d.source.y - n.y
          },
          angle
        ),
        rotatedPointC = that.rotatePoint(
          center, {
            x: d.target.x - d.source.x + n.x - n1.x,
            y: d.target.y - d.source.y + n.y - n1.y
          },
          angle
        ),
        rotatedPointD = that.rotatePoint(
          center, {
            x: 0 + n.x - n1.x,
            y: 0 + n.y - n1.y
          },
          angle
        );

      return (
        "M " +
        rotatedPointA.x +
        " " +
        rotatedPointA.y +
        " L " +
        rotatedPointB.x +
        " " +
        rotatedPointB.y +
        " L " +
        rotatedPointC.x +
        " " +
        rotatedPointC.y +
        " L " +
        rotatedPointD.x +
        " " +
        rotatedPointD.y +
        " Z"
      );
    });
  };

  /**
   * 统一正常导航
   *
   * @param {*}
   *            source
   * @param {*}
   *            target
   * @param {*}
   *            newLength
   */
  this.unitaryNormalVector = function (source, target, newLength) {
    var center = {
        x: 0,
        y: 0
      },
      vector = this.unitaryVector(source, target, newLength);

    return this.rotatePoint(center, vector, 90);
  };
  /**
   * 统一导航
   *
   * @param {*}
   *            source
   * @param {*}
   *            target
   * @param {*}
   *            newLength
   */
  this.unitaryVector = function (source, target, newLength) {
    var length =
      Math.sqrt(
        Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)
      ) / Math.sqrt(newLength || 1);

    return {
      x: (target.x - source.x) / length,
      y: (target.y - source.y) / length
    };
  };
  /**
   * 旋转
   *
   * @param {*}
   *            cx
   * @param {*}
   *            cy
   * @param {*}
   *            x
   * @param {*}
   *            y
   * @param {*}
   *            angle
   */
  this.rotate = function (cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = cos * (x - cx) + sin * (y - cy) + cx,
      ny = cos * (y - cy) - sin * (x - cx) + cy;

    return {
      x: nx,
      y: ny
    };
  };
  /**
   * 旋转节点
   *
   * @param {*}
   *            c
   * @param {*}
   *            p
   * @param {*}
   *            angle
   */
  this.rotatePoint = function (c, p, angle) {
    return this.rotate(c.x, c.y, p.x, p.y, angle);
  };
  /**
   * 变焦适合
   *
   * @param {g}
   *            transitionDuration
   */
  this.zoomFit = function (transitionDuration) {
    var bounds = this.svg.node().getBBox(),
      parent = this.svg.node().parentElement.parentElement,
      fullWidth = parent.clientWidth,
      fullHeight = parent.clientHeight,
      width = bounds.width,
      height = bounds.height,
      midX = bounds.x + width / 2,
      midY = bounds.y + height / 2;
    if (width === 0 || height === 0) {
      return; // nothing to fit
    }
    this.svgScale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
    this.svgTranslate = [
      fullWidth / 2 - this.svgScale * midX,
      fullHeight / 2 - this.svgScale * midY
    ];

    this.svg.attr(
      "transform",
      "translate(" +
      this.svgTranslate[0] +
      ", " +
      this.svgTranslate[1] +
      ") scale(" +
      this.svgScale +
      ")"
    );
    // smoothTransform(svgTranslate, svgScale);
  };
  /**
   * 包含方法判断
   *
   * @param {*}
   *            array
   * @param {*}
   *            id
   */
  this.contains = function (array, id) {
    var filter = array.filter(function (elem) {
      return elem.id === id;
    });
    return filter.length > 0;
  };
  /**
   * neo4j数据转d3数据
   *
   * @param {*}
   *            data
   */
  this.neo4jDataToD3Data = function (data) {
    var graph = {
      nodes: [],
      relationships: []
    };
    if (data) {
      var that = this;
      data.results.forEach(function (result) {
        result.data.forEach(function (data) {
          if (data.graph.nodes && data.graph.nodes.length > 0) {
            data.graph.nodes.forEach(function (node) {
              if (!that.contains(graph.nodes, node.id)) {
                node.selected = false; // 设置节点未被单选
                node.multiSelected = false; // 设置节点未被多选
                graph.nodes.push(node);
              }
            });
          }
          if (data.graph.relationships && data.graph.relationships.length > 0) {
            data.graph.relationships.forEach(function (relationship) {
              relationship.source = relationship.startNode;
              relationship.target = relationship.endNode;
              relationship.selected = false; // 设置线未被单选
              relationship.multiSelected = false; // 设置线未被多选
              graph.relationships.push(relationship);
            });

            data.graph.relationships.sort(function (a, b) {
              // 排序
              if (a.source > b.source) {
                return 1;
              } else if (a.source < b.source) {
                return -1;
              } else {
                if (a.target > b.target) {
                  return 1;
                }

                if (a.target < b.target) {
                  return -1;
                } else {
                  return 0;
                }
              }
            });
            for (var i = 0; i < data.graph.relationships.length; i++) {
              if (
                i !== 0 &&
                data.graph.relationships[i].source ===
                data.graph.relationships[i - 1].source &&
                data.graph.relationships[i].target ===
                data.graph.relationships[i - 1].target
              ) {
                data.graph.relationships[i].linknum =
                  data.graph.relationships[i - 1].linknum + 1;
              } else {
                data.graph.relationships[i].linknum = 1;
              }
            }
          }
        });
      });
    }

    return graph;
  };
  /**
   * 更新d3数据
   *
   * @param {*}
   *            d3Data //画图数据
   * @param {*}
   *            divId //回退前进使用
   * @param {*}
   *            status //回退前进使用
   * @param {*}
   *            updateNode //更新节点属性使用 为需要更新的节点集合
   */
  this.updateWithD3Data = function (d3Data, divId, status, updateNode) {
    // if(divId){//如果divId存在则记录操作数据
    this.updateNodesAndRelationships(
      d3Data.nodes,
      d3Data.relationships,
      updateNode
    );
    // 获取旧数据标记列表,并根据旧数据标记数据 标记当前图中节点
    // mark_list();
    // 重复线的处理
    //    if (that.relationships.length > 0) {
    //      many_lines();
    //    }
  };
  /**
   * 更新节点和关系
   *
   * @param {*}
   *            n 节点集合
   * @param {*}
   *            r 关系集合
   * @param {*}
   *            updateNode /更新节点属性使用 为需要更新的节点集合
   */
  this.updateNodesAndRelationships = function (n, r, updateNode) {
    this.updateRelationships(r); // 更新关系

    this.updateNodes(n, updateNode); // 更新节点
    this.simulation.nodes(this.nodes); // 布局添加
    this.simulation.force("link").links(this.relationships); // 布局添加
    // this.zoomFit(2); // 变焦适合
    this.simulation.alphaTarget(0.1).restart();
    if (this.circle) {
      // 判断是否已存在半圆，如果存在则删除
      this.circle.remove();
    }
  };
  /**
   * 更新节点
   *
   * @param {*}
   *            n
   * @param {*}
   *            updateNode 更新节点属性
   */
  this.updateNodes = function (n, updateNode) {
    var that = this;
    var nodeArr = [];
    that.nodes.forEach(d => {
      // 过滤已有关系线
      n.forEach(v => {
        if (v.id === d.id) {
          nodeArr.push(v);
        }
      });
    });
    nodeArr.forEach(d => {
      n.splice(n.indexOf(d), 1);
    });
    //未增加节点 做相关提示
    if (n.length == 0) {
      layerWarning("目标节点已存在图中");
    }
    Array.prototype.push.apply(that.nodes, n);
    // 增加更新节点属性
    if (updateNode) {
      that.nodes.forEach(function (element, index) {
        updateNode.forEach(function (element1, index1) {
          if (element.id === element1.id) {
            element.labels = element1.labels;
          }
        });
      });
    }
    // console.log(that.nodes)
    that.node = that.svgNodes.selectAll(".node").data(that.nodes, function (d) {
      d.selected = false; // 设置节点未被单选
      d.multiSelected = false; // 设置节点未被多选
      return d.id;
    });
    var nodeEnter = that.appendNodeToGraph(); // 添加节点到图
    that.node = nodeEnter.merge(that.node);
  };
  /**
   * 添加节点到图
   */
  this.appendNodeToGraph = function () {
    var n = this.appendNode(); // 添加节点
    this.appendRingToNode(n); // 节点添加选中的外圆
    // this.appendOutlineToNode(n); //节点添加内圆
    this.appendTextToNode(n); // 节点添加文字
    this.appendImageToNode(n); // 节点添加右下角的图标
    return n;
  };
  /**
   * 节点添加选中的外圆
   *
   * @param {*}
   *            node
   */
  this.appendRingToNode = function (node) {
    var that = this;
    return (
      node
      .append("circle")
      .attr("class", "ring")
      // .attr('r', this.options.nodeRadius * 1.16)
      .attr("r", function (d) { // if(d.labels.indexOf("现实人员") != -1) return
        return that.options.nodeRadius
      })
      .append("title")
      .text(function (d) {
        return that.toString(d);
      })
    );
  };
  /**
   * 节点添加内圆
   *
   * @param {*}
   *            node
   */
  this.appendOutlineToNode = function (node) {
    var that = this;
    return node
      .append("circle")
      .attr("class", "outline")
      .attr("r", this.options.nodeRadius)
      .style("fill", function (d) {
        if (d.labels.indexOf("人") != -1) {
          return "#fb95af"; // 人物 // light pink
        } else if (d.labels.indexOf("地") != -1) {
          return "#f1c652"; // 地点 // purple
        } else if (d.labels.indexOf("事") != -1) {
          return "#f4a66d"; // 事件 // light red
        } else if (d.labels.indexOf("物") != -1) {
          return "#ffa087"; // 物 // green #1
        } else if (d.labels.indexOf("组织") != -1) {
          return "#6dce9e"; // 组织 // light blue
        } else {
          return that.options.nodeOutlineFillColor ?
            that.options.nodeOutlineFillColor :
            that.class2color(d.labels[0]);
        }
      })
      .style("stroke", function (d) {
        if (d.labels.indexOf("人") != -1) {
          return "#bf7b90"; // 人物 // light pink
        } else if (d.labels.indexOf("地") != -1) {
          return "#caa02e"; // 地点 // purple
        } else if (d.labels.indexOf("事") != -1) {
          return "#f19653"; // 事件 // light red
        } else if (d.labels.indexOf("物") != -1) {
          return "#ffc8b9"; // 物 // green #1
        } else if (d.labels.indexOf("组织") != -1) {
          return "#60b58b"; // 组织 // light blue
        } else {
          return that.options.nodeOutlineFillColor ?
            that.class2darkenColor(that.options.nodeOutlineFillColor) :
            that.class2darkenColor(d.labels[0]);
        }
      })
      .append("title")
      .text(function (d) {
        return that.toString(d);
      });
  };
  /**
   * 绘图初始化
   */
  this.d3Reset = function () {
    var that = this;
    // 在初始化前保存初始化的数据
    var obj = {};
    obj.nodes = that.nodes;
    obj.relationships = that.relationships;
    /*if (obj.nodes.length === 0) {
      // 图中没有节点时点击初始化绘图按钮
      return;
    }*/
    if (!status) {
      obj.status = "delete";
      neo.back_arr.push(obj);
    }

    that.node.remove();
    that.relationship.remove();
    /**
     * ****************以下方法会改变 this.svg 内数据 删除元素之后 再添加元素正常**********************
     */
    that.node._groups[0] = [];
    that.nodes = [];
    that.relationships = [];
    that.relationship._groups[0] = [];
    // 初始化右侧列表
    //that.loadNeo4jDataFromUrl();
    that.loadNeo4jDataFromUrl(
      "/knowledge-graph/hello/dataSource/accordingToTypeStatistics"
    );
    // 关闭所有弹窗
    // 节点双击弹窗
    $("#tt").tabs("close", "查询结果");
    $("#tt").tabs("close", "多点分析结果");
    $("#tt").tabs("close", "深度推理结果");
    $("#tt").tabs("close", "二维扩展");
    $("#tt").tabs("close", "好友关系数统计");
    $("#tt").tabs("close", "共同好友排行");
    $("#tt").tabs("close", "好友互动次数排行");
    $("#tt").tabs("close", "潜在可能认识的人");
    $("#tt").tabs("close", "可落地人员推荐");
    $("#tt").tabs("close", "社交联系紧密人员");
    $("#tt").tabs("close", "属性扩展");
    $("#tt").tabs("close", "互动网络推荐");

    $(".node_flag_box ul").html("");
    $("#node_rsgl_box ul").html(""); // 初始化
    // 初始化节点详情
    $("#node_detail").css("display", "none");
    $("#relation_detail").css("display", "none");
    $("#personInformation").css("display", "none");
    $(".node_detail_box").html(""); // 清空节点详情信息
    $("#newRelationshipPageBootmSonId").html(""); // 清空左侧列表
    $(".RecommendListCustom").css("display", "none"); // 推荐列表
    $("#selectAllNodeId #node_num").html("共0个");
    $("#postDetail_ID .containerCustomContentNewAddBox").hide();

    // 初始化关系标记
    if (existKey && existKey.length > 0) {
      existKey = [];
    }
  };
  /**
   * 多节点删除
   */
  this.nodesRemove = function (model) {
    var that = this;
    var node;
    var Relationships;
    // 过滤出多选的点
    if (that.node) {
      node = that.node.filter(function (d) {
        return d.multiSelected === true || d.selected === true;
      });
    }
    // 通过多选的点,找到这些点相关的线
    if (that.relationship) {
      Relationships = that.relationship.filter(function (d) {
        var falt = false;
        node.data().forEach(function (item) {
          // 找到 起点或终点 为 选中点的线
          if (d.source.id === item.id || d.target.id === item.id) {
            falt = true;
          }
        });
        return falt;
      });
    }
    // 记录删除前的标记列表
    // refresh_before_list();
    // 清空删除节点的标记样式
    // empty_fill(node);
    // 选中的节点的删除
    if (model != null) {
      // 关系删除时使用
      that.nodesDelete(null, model);
    } else {
      that.nodesDelete(node, Relationships);
    }
  };
  this.nodesDelete = function (node, Relationships, status) {
    var that = this;
    // nodes 排完重的节点 relationships排完重的关系 记录
    var obj = {};
    // 移除多选的点 和 线
    if (node) {
      if (node._groups && node._groups[0] && node._groups[0].length > 0) {
        var nodes = [];
        for (var int = 0; int < node._groups[0].length; int++) {
          nodes.push(node._groups[0][int].__data__);
        }
        // 添加判断 所删节点是否包含双击节点/多点间的关系 如果包含则关闭弹窗
        // ①删除的节点（判断是否包含双击节点 ，如果包含则关闭弹窗）
        if (neo.double_click_obj) {
          nodes.forEach(function (element, index) {
            if (neo.double_click_obj.id === element.id) {
              $("#tt").tabs("close", "查询结果");
            }
          });
        }
        // ②判断是否包含多选的点
        if (neo.select_many_arr.length > 0) {
          nodes.forEach(function (element, index) {
            neo.select_many_arr.forEach(function (element1, index1) {
              if (element.id === element1.id) {
                $("#tt").tabs("close", "多点分析结果");
              }
            });
          });
        }
        // ③判断是否包含深度推理的点
        if (neo.select_analysis_arr.length > 0) {
          nodes.forEach(function (element, index) {
            neo.select_analysis_arr.forEach(function (element1, index1) {
              if (element.id === element1.id) {
                $("#tt").tabs("close", "深度推理结果");
              }
            });
          });
        }

        obj.nodes = nodes;
        node.remove(); // 显示节点移除
        recovery_state(nodes); // 删除节点的同时恢复右侧列表中可添加点的样式
      }
    }
    if (Relationships) {
      if (
        Relationships._groups &&
        Relationships._groups[0] &&
        Relationships._groups[0].length > 0
      ) {
        var relation = [];
        for (var int = 0; int < Relationships._groups[0].length; int++) {
          relation.push(Relationships._groups[0][int].__data__);
        }
        obj.relationships = relation;
        Relationships.remove(); // //显示关系移除
      }
    }
    if (!status) {
      obj.status = "delete";
      neo.back_arr.push(obj);
    }

    /**
     * ****************以下方法会改变 this.svg 内数据 删除元素之后 再添加元素正常**********************
     */
    Array.prototype.remove = function (val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };
    if (Relationships) {
      if (
        Relationships._groups &&
        Relationships._groups[0] &&
        Relationships._groups[0].length > 0
      ) {
        Relationships._groups[0].forEach(element => {
          that.relationships.remove(element.__data__); // 关系array移除
          that.relationship._groups[0].remove(element); // 关系 元素标签移除
        });
      }
    }
    if (node) {
      if (node._groups && node._groups[0] && node._groups[0].length > 0) {
        node._groups[0].forEach(element => {
          that.nodes.remove(element.__data__); // 节点 array移除
          that.node._groups[0].remove(element); // 节点 元素标签移除
        });
      }
    }
    // 刷新标记列表
    refresh_graph_list();
    // 刷新关系标记列表
    // refresh_relation_list();
  };
  /**
   * 标签类型判断
   *
   * @param {*}
   *            d
   */
  this.labelType = function (d) {};
  /**
   * 属性转换文本展示
   *
   * @param {*}
   *            d
   */
  this.toString = function (d) {
    var s = d.labels ? d.labels[0] : d.type;
    // s += ' (<id>: ' + d.id;
    // Object.keys(d.properties).forEach(function (property) {
    // s += ', ' + property + ': ' + JSON.stringify(d.properties[property]);
    // });
    // s += ')';
    return s;
  };
  /**
   * 添加文字到节点 （将图标转为文字）
   *
   * @param {*}
   *            node
   */
  this.appendTextToNode = function (node) {
    var that = this;
    return (
      node
      .append("text")
      // .attr('class', function (d) {
      // return 'text' + (that.icon(d) ? ' icon' : '');
      // })
      .attr("fill", function () {
        if(that.options.nodeTextColor){
          return that.options.nodeTextColor;
        }
        return "#1862d5";
      })
      .attr("font-weight", "bolder")
      .attr("font-size", function () {
        if(that.options.nodeTextSize){
          return that.options.nodeTextSize;
        }
        return 20;
      })
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("y", function (d) {
        return that.options.nodeRadius ?
          parseInt(Math.round(that.options.nodeRadius * 0.8)) + "px" :
          "20px";
      })
      .html(function (d) {
        if (d.properties.name) {
          // 通过不同的命名规则 展示不同的文本
          var name;
          var text;
          text = that.getText(d, "nodeText");
          return text;
        }
        return d.properties.name; // node节点显示其name
      })
    );
  };
  /**
   * 添加图片到节点右下角
   *
   * @param {*}
   *            node
   */
  this.appendImageToNode = function (node) {
    var that = this;
    return node
      .append("image")
      .attr("height", function (d) {
        return that.options.nodeRadius+"px";
      })
      .attr("width", function (d) {
        return that.options.nodeRadius+"px";
      })
      .attr("x", function (d) {
        return that.options.nodeX+"px";
      })
      .attr("y", function (d) {
        return that.options.nodeY+"px";
      })
      .attr("xlink:href", function (d) {
        // 根据图片路径加载对应的图片
        var text;
        text = that.getText(d, "nodeImg");
        return text;
      })
  };
  /**
   * 添加节点
   */
  this.appendNode = function () {
    var that = this;
    /**
     * 节点拖拽结束事件
     *
     * @param {*}
     *            d
     */
    var dragEnded = function (d) {
      if (!d3.event.active) {
        that.simulation.alphaTarget(0);
      }
      onNodeDragEnd(d);
      if (typeof that.options.onNodeDragEnd === "function") {
        that.options.onNodeDragEnd(d);
      }
    };
    /**
     * 拖拽结束事件
     *
     * @param {*}
     *            d
     */
    var onNodeDragEnd = function (d) {
      that.node
        .each(function (d) {
        });
    };
    /**
     * 节点拖拽中事件
     *
     * @param {*}
     *            d
     */
    var dragged = function (d) {
      that.stickNode(d);
      that.stickCircle(d);
    };
    /**
     * 节点拖拽开始事件
     *
     * @param {*}
     *            d
     */
    var dragStarted = function (d) {
      if (!d3.event.active) {
        that.simulation.alphaTarget(0.1).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
      that.node.filter(function (d) {
          return d.multiSelected;
        })
        .each(function (d) {
          d.fx = d.x;
          d.fy = d.y;
        });
      if (typeof that.options.onNodeDragStart === "function") {
        that.options.onNodeDragStart(d);
      }
      // 节点移动 将状态改为解锁
      if (
        $(".unlockCstyle")
        .find("i")
        .hasClass("lock")
      ) {
        $(".unlockCstyle")
          .find("i")
          .removeClass("lock");
      }
    };
    var dragsubject = function () {
      return that.simulation.find(d3.event.x, d3.event.y);
    };

    return this.node
      .enter()
      .append("g")
      .attr("class", function (d) {
        var highlight,
          i,
          classes = "node"
        if (that.image(d)) {
          classes += " node-image"; // 处理右下角图标
        }
        return classes;
      })
      .on("click", function (d) {
        if (typeof that.onNodeClick === "function") {
          that.onNodeClick(d);
        }
        
      })
      .on("dblclick", function (d) {
        // 节点双击事件
        if (typeof that.onNodeDoubleClick === "function") {
          that.onNodeDoubleClick(d);
        }
      })
      .on("mouseenter", function (d) {
        if (typeof that.onNodeMouseEnter === "function") {
          // 使该节点相连的线 全hover
          that.onNodeMouseEnter(d);
        }
      })
      .on("mouseleave", function (d) {
        if (typeof that.onNodeMouseLeave === "function") {
          that.onNodeMouseLeave(d);
        }
      })
      .call(
        d3
        .drag()
        .subject(dragsubject)
        .on("start", dragStarted) // 节点拖拽开始事件
        .on("drag", dragged) // 节点拖拽中事件
        .on("end", dragEnded)
      ); // 节点拖拽结束事件
  };

  /**
   * 鼠标进入节点方法
   *
   * @param {*}
   *            d
   */
  this.onNodeMouseEnter = function (d) {
    var that = this;
    // 高亮所选节点相连的线的功能
    that.relationship.classed("hover", false);
    that.relationship.classed("hover", function (p) {
      return (p.hover = d === p.source || d === p.target);
    });
  };
  /**
   * 鼠标离开节点方法
   *
   * @param {*}
   *            d
   */
  this.onNodeMouseLeave = function (d) {
    var that = this;
    // 取消高亮所选节点相连的线的功能
    if (!d.selected) {
      // 如果未被选择 则取消hover效果
      that.relationship.classed("hover", false);
      $("#node_detail").css("display", "none");
      // $("#relation_detail").css("display", "none");
      $("#personInformation").css("display", "none");
      $(".node_detail_box").html(""); // 清空节点详情信息
    }
  };
  /**
   * 节点单击事件
   */
  // var ctrlArr = [];//多选节点后放入数组中
  this.ctrlArr = []; // 多选节点后放入数组中 初始值 用于多节点查询
  this.onNodeClick = function (d) {
    var that = this;
    that.onNodeMouseEnter(d); // 节点相连的关系高亮
    // ctrl 多选功能
    if (d3.event.ctrlKey || d3.event.metaKey) {
      // metaKey : 按住 或 持续
      d.selected = false;
      if (that.ctrlArr.length > 0 && !that.ctrlArr[0].multiSelected) {
        // 如果
        // 数组长度大于0，同时第一个元素的多选属性为false
        // 则说明是单选操作，则情况数组
        that.ctrlArr = [];
      }
      that.node.classed("selected", false); // 取消单选效果
      that.node
        .filter(function (p) {
          p.selected = false;
          return d === p;
        })
        .classed("multiSelected", function (d) {
          // 如果当前元素是多选状态 则删除该元素
          if (d.multiSelected) {
            that.ctrlArr.splice(that.ctrlArr.indexOf(d), 1);
          } else {
            // 反之则增加该元素
            that.ctrlArr.push(d);
          }
          return (d.multiSelected = !d.multiSelected);
        });
      d3.event.stopImmediatePropagation();
    } else if (
      (!d.selected && d.multiSelected) ||
      (!d.selected && !d.multiSelected)
    ) {
      // 单元操作 每次都清空元素 再添加，保持只存在一个元素
      that.ctrlArr = [];
      that.ctrlArr.push(d);

      d.multiSelected = false;
      that.node.filter(function (p) {
        p.multiSelected = false;
        return d === p;
      });
      that.node.classed("multiSelected", false); // 取消多选效果
      // 单选功能
      that.node.classed("selected", function (p) {
        return (p.selected = d === p);
      });
      //this.appendCircle(d); // 添加半圆功能选择
    } else if (
      (d.selected && !d.multiSelected) ||
      (d.selected && d.multiSelected)
    ) {
      // 元素为选中效果， 则清空该数据
      that.ctrlArr = [];

      d.multiSelected = false;
      d.selected = !d.selected;
      that.node.filter(function (p) {
        p.multiSelected = false;
        return d === p;
      });
      that.node.classed("selected", false); // 取消单选效果
      that.node.classed("multiSelected", false); // 取消多选效果
    } else {
      //this.appendCircle(d); // 添加半圆功能选择
    }
    // 显示已选节点
    // select_nodes_show(that.ctrlArr);
    // 节点单击 将状态改为解锁状态
    if (
      $(".unlockCstyle")
      .find("i")
      .hasClass("lock")
    ) {
      $(".unlockCstyle")
        .find("i")
        .removeClass("lock");
    }
  };
  /**
   * 添加圆环选项 1.创建生成器 2.转化数据 3.绘制
   */
  this.appendCircle = function (d) {
    var that = this;
    var cirData = [{
        name: "属性扩展",
        title: "属性扩展"
      },
      {
        name: "扩展",
        title: "扩展"
      },
      {
        name: "删除",
        title: "删除"
      },
      {
        name: "定向",
        title: "定向"
      },
      {
        name: "标记",
        title: "标记"
      },
      {
        name: "二维扩展",
        title: "二维扩展"
      }
    ];
    var data = [5, 5, 5, 5, 5, 5]; // 弧形分段数据
    var outerRadius = 100, // 外弧度
      innerRadius = outerRadius / 2.5, // 内弧度
      cornerRadius = 10; // 中心角度
    var pie = d3
      .pie() // 创建一个新的饼图生成器
      .padAngle(0.02); // 为填充的弧设置相邻弧之间的角度。
    var arc = d3
      .arc() // 创建一个新的电弧发生器
      .padRadius(outerRadius)
      .innerRadius(innerRadius); // 设置内半径。
    if (this.circle) {
      // 判断是否已存在半圆，如果存在则删除
      this.circle.remove();
    }
    var svg = this.svg
      .append("g")
      .attr("class", "nodeCircle")
      .attr("cursor", "pointer")
      .attr("transform", "translate(" + d.x + "," + d.y + ")") // 绘图的位置
      .on("mouseleave", function (d) {
        // 节点鼠标离开事件
        if (that.circle) {
          // 判断是否已存在半圆，如果存在则删除
          that.circle.remove();
        }
      });
    svg
      .selectAll("path")
      .data(pie(data)) // 生成对应分区的圆饼 计算给定数据集的弧角
      .enter()
      .append("path")
      .attr("fill", function (d) {
        switch (d.index) {
          case 0:
            return "#37bab7"; //属性扩展
            break;
          case 1:
            return "#c9903e"; //扩展
            break;
          case 2:
            return "red"; //删除
            break;
          case 3:
            return "#fe8767"; //定向
            break;
          case 4:
            return "#30c159"; //标记
            break;
          case 5:
            return "#b7b927"; //二维扩展
            break;
          default:
            return "#30c159";
            break;
        }
      })
      .attr("name", function (d) {
        return cirData[d.index].name;
      })
      .each(function (d, i) {
        // 遍历 设置每个分区的属性
        addtext(svg, cirData, i);
        d.outerRadius = outerRadius - 20;
      })
      .attr("d", arc) // 叠加圆弧
      .on("mouseover", arcTween(outerRadius - 5, 0))
      .on("click", arcClick)
      .on("mouseout", arcTween(outerRadius - 20, 150));
    this.circle = svg; //外环
    /**
     * 圆弧单击事件
     *
     * @param {*}
     *            d
     */
    function arcClick(d) {
      var thatArc = this;
      var clickName = d3.select(thatArc).attr("name");
      if (clickName === "解锁") {
        var node = that.node.filter(function (d) {
          return d.selected === true;
        });
        node.data()[0].fx = node.data()[0].fy = null;
      } else if (clickName === "属性扩展") {
        var node = that.node.filter(function (d) {
          return d.selected === true;
        });
        attribute_extension(node.data()[0]);
      } else if (clickName === "删除") {
        var node = that.node.filter(function (d) {
          d.multiSelected = false;
          return d.selected === true;
        });
        // 报告操作
        if (param.isFullScreen == 1 && node.data().length > 0) {
          reportNodeDelete(param.reportData.children, node.data()[0], option);
        }
        var Relationships;
        if (node._groups[0].length === 1) {
          Relationships = that.relationship.filter(function (d, i) {
            return d.source === node.data()[0] || d.target === node.data()[0];
          });
          // 记录删除前的标记列表
          // refresh_before_list();
          // 清空删除节点的标记样式
          // empty_fill(node);
          node.remove(); // 显示节点移除
          Relationships.remove(); // //显示关系移除
          // 增加记录操作
          that.nodesDelete(node, Relationships);
          /**
           * ****************以下方法会改变 this.svg 内数据 删除元素之后
           * 再添加元素正常**********************
           */
          Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
              this.splice(index, 1);
            }
          };
          if (Relationships._groups[0] && Relationships._groups[0].length > 0) {
            Relationships._groups[0].forEach(element => {
              that.relationship._groups[0].remove(element); // 关系
              // 元素标签移除
              that.relationships.remove(element.__data__); // 关系array移除
            });
          }
          that.node._groups[0].remove(node._groups[0][0]); // 节点 元素标签移除
          that.nodes.remove(node._groups[0][0].__data__); // 节点
          // array移除
        }
        // 刷新标记列表
        refresh_graph_list();
        /**
         * ******以下方法不会改变 this.svg 内数据 删除元素之后
         * 再添加元素会将之前删除的元素渲染出来在添加元素******
         */
        if (svg) {
          // 判断是否已存在半圆，如果存在则删除
          svg.remove();
        }
        newRelationshipPageBootmSon_list();
      } else if (clickName === "扩展") {
        var node = that.node.filter(function (d) {
          // 选中的节点
          return d.selected === true;
        });
        // node.data()[0] 节点数据
        that.getDataById.call(that, node);
        // 扩展方法只需要当前节点的信息即可
      } else if (clickName === "标记") {
        var node = that.node.filter(function (d) {
          // 选中的节点
          return d.selected === true;
        });
        user_tagging(node.data()[0]); // 用户标记弹窗页面
      } else if (clickName === "定向") {
        var node = that.node.filter(function (d) {
          // 选中的节点
          return d.selected === true;
        });
        // 初始化节点数默认值
        $("input[name='fill_in_count']").val("10");
        // 初始化数组
        neo.checkbox_node_arr = [];
        neo.checkbox_rela_arr = [];
        directional_expansion(that, node);
      } else if (clickName === "二维扩展") {
        // DOTO 在扩展出来节点的基础上把所有多个节点再扩一遍
        var node = that.node.filter(function (d) {
          // 选中的节点
          return d.selected === true;
        });
        that.getTwoDimensionalExpansion.call(that, node);
      }
    }
    /**
     * 半圆增加文字
     *
     * @param {*}
     *            element
     * @param {*}
     *            cirData
     * @param {*}
     *            i
     */
    function addtext(element, cirData, i) {
      element
        .append("text")
        .attr("class", function (d) {
          return "circleText" + i;
        })
        .attr("transform", function (d) {
          switch (i) {
            case 0:
              return "rotate(40, 45 -45)"; //解锁
              break;
            case 1:
              return "rotate(90, 53 10)"; //扩展
              break;
            case 2:
              return "rotate(335, 50 15)"; //删除
              break;
            case 3:
              return "rotate(390, -70 45)"; //全体解锁
              break;
            case 4:
              return "rotate(265, -45 0)"; //全体锁定
              break;
            case 5:
              return "rotate(325, -30 -25)"; //定向
              break;
            default:
              return "";
              break;
          }
        })
        .attr("fill", "#8bf1d7")
        .attr("font-size", function (d) {
          return "12.5px";
        })
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .attr("y", function (d) {
          // 计算 对应的文字的位置坐标
          var y =
            Math.sin((Math.PI / 180) * (360 / cirData.length) * (i - 0.8)) *
            1.8 *
            that.options.nodeRadius;
          return y + "px";
        })
        .attr("x", function (d) {
          var x =
            Math.cos((Math.PI / 180) * (360 / cirData.length) * (i - 0.8)) *
            1.8 *
            that.options.nodeRadius;
          return x + "px";
        })
        .html(function (d) {
          return cirData[i].name;
        });
    }

    /**
     * 鼠标hover变大效果
     *
     * @param {*}
     *            outerRadius
     * @param {*}
     *            delay
     */
    function arcTween(outerRadius, delay) {
      return function () {
        d3.select(this)
          .transition()
          .delay(delay)
          .attrTween("d", function (d) {
            var i = d3.interpolate(d.outerRadius, outerRadius);
            return function (t) {
              d.outerRadius = i(t);
              return arc(d);
            };
          });
      };
    }
  };
  /**
   * 节点双击加载新数据
   *
   * @param {*}
   *            node
   */
  this.onNodeDoubleClick = function (node) {
  };
  /**
   * 节点返回
   *
   * @param {*}
   *            d
   */
  this.stickNode = function (d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
    var that = this;
    that.node.filter(function (d) {
        return d.multiSelected;
      })
      .each(function (d) {
        d.fx += d3.event.dx;
        d.fy += d3.event.dy;
      });
  };
  /**
   * 节点返回
   *
   * @param {*}
   *            d
   */
  this.stickCircle = function (node) {
    if (this.circle && node.x && node.y) {
      this.circle.attr("transform", function (d) {
        return "translate(" + node.x + ", " + node.y + ")";
      });
    }
  };
  /**
   * 图标处理
   *
   * @param {*}
   *            d
   */
  this.icon = function (d) {
    var code;
    if (this.options.iconMap && this.options.showIcons && this.options.icons) {
      if (
        this.options.icons[d.labels[0]] &&
        this.options.iconMap[this.options.icons[d.labels[0]]]
      ) {
        code = this.options.iconMap[this.options.icons[d.labels[0]]];
      } else if (this.options.iconMap[d.labels[0]]) {
        code = this.options.iconMap[d.labels[0]];
      } else if (this.options.icons[d.labels[0]]) {
        code = this.options.icons[d.labels[0]];
      }
    }

    return code;
  };
  /**
   * 图片处理
   *
   * @param {*}
   *            d
   */
  this.image = function (d) {
    var i,
      imagesForLabel,
      img,
      imgLevel,
      label,
      labelPropertyValue,
      property,
      value;
    var that = this;
    if (this.options.images) {
      imagesForLabel = that.options.imageMap[d.labels[0]];

      if (imagesForLabel) {
        imgLevel = 0;

        for (i = 0; i < imagesForLabel.length; i++) {
          labelPropertyValue = imagesForLabel[i].split("|");

          switch (labelPropertyValue.length) {
            case 3:
              value = labelPropertyValue[2];
              /* falls through */
            case 2:
              property = labelPropertyValue[1];
              /* falls through */
            case 1:
              label = labelPropertyValue[0];
          }

          if (
            d.labels[0] === label &&
            (!property || d.properties[property] !== undefined) &&
            (!value || d.properties[property] === value)
          ) {
            if (labelPropertyValue.length > imgLevel) {
              img = that.options.images[imagesForLabel[i]];
              imgLevel = labelPropertyValue.length;
            }
          }
        }
      }
    }

    return img;
  };
  /**
   * 更新关系
   *
   * @param {*}
   *            r
   */
  this.updateRelationships = function (r) {
    var that = this;
    var relationsArr = [];
    that.relationships.forEach(d => {
      // 过滤已有关系线
      r.forEach(v => {
        if (v.id === d.id) {
          relationsArr.push(v);
        }
      });
    });
    relationsArr.forEach(d => {
      // 过滤已有关系线
      r.splice(r.indexOf(d), 1);
    });
    Array.prototype.push.apply(this.relationships, r);
    //处理线  将线进行统计和分组  不区分连接线的方向，只要属于同两个实体，即认为是同一组
    this.linesGrouping(this.relationships);
    var set = new Set();
    if (this.relationships) {
      this.relationships = this.relationships.filter(function (element) {
        var flat = false;
          flat = true;
        return flat;
      });
    }
    this.relationship = this.svgRelationships
      .selectAll(".relationship")
      .data(this.relationships, function (d) {
        return d.id;
      });
    var relationshipEnter = this.appendRelationshipToGraph(); // 添加关系线到图
    // 将d3 json格式数据，转换为对应的d3格式数据
    this.relationship = relationshipEnter.relationship.merge(this.relationship); // d3格式数据
    // 合并 this.relationship以及都是d3格式数据了
    this.relationshipOutline = this.svg.selectAll(".relationship .outline"); // 添加外部关系线
    this.relationshipOutline = relationshipEnter.outline.merge(
      this.relationshipOutline
    );
    // this.relationshipOverlay = this.svg.selectAll('.relationship .overlay');
    // //添加覆盖关系线
    // this.relationshipOverlay =
    // relationshipEnter.overlay.merge(this.relationshipOverlay);
    this.relationshipText = this.svg.selectAll(".relationship .text"); // 添加关系文字
    this.relationshipText = relationshipEnter.text.merge(this.relationshipText);
  };
  /**
   * 对线进行分组和统计
   */
  this.linesGrouping = function (links) {
    var that = this;
    //关系分组
    var linkGroup = {};
    //对连接线进行统计和分组，不区分连接线的方向，只要属于同两个实体，即认为是同一组
    var linkmap = {}
    for (var i = 0; i < links.length; i++) {
      var key = 0;
      var source = links[i].source;
      if (source != null && source != "" && source != undefined) {
        if (source.id) {
          key = links[i].source.id < links[i].target.id ? links[i].source.id +
            ':' + links[i].target.id : links[i].target.id +
            ':' + links[i].source.id;
        } else {
          key = links[i].source < links[i].target ? links[i].source +
            ':' + links[i].target : links[i].target +
            ':' + links[i].source;
        }
      }
      if (!linkmap.hasOwnProperty(key)) {
        linkmap[key] = 0;
      }
      linkmap[key] += 1;

      if (!linkGroup.hasOwnProperty(key)) {
        linkGroup[key] = [];
      }
      linkGroup[key].push(links[i]);
    }
    //为每一条连接线分配size属性，同时对每一组连接线进行编号
    for (var i = 0; i < links.length; i++) {
      var key = 0;
      var source = links[i].source;
      if (source != null && source != "" && source != undefined) {
        if (source.id) {
          key = links[i].source.id < links[i].target.id ? links[i].source.id +
            ':' + links[i].target.id : links[i].target.id +
            ':' + links[i].source.id;
        } else {
          key = links[i].source < links[i].target ? links[i].source +
            ':' + links[i].target : links[i].target +
            ':' + links[i].source;
        }
      }
      links[i].size = linkmap[key];
      //同一组的关系进行编号
      var group = linkGroup[key];
      var keyPair;
      if (key != null && key != 0) {
        keyPair = key.split(':');
      }
      var type = 'noself'; //标示该组关系是指向两个不同实体还是同一个实体
      if (keyPair != null && keyPair != "" && keyPair != undefined) {
        if (keyPair[0] == keyPair[1]) {
          type = 'self';
        }
      }
      //给节点分配编号
      that.setLinkNumber(group, type);
    }
    return links
  }
  /**
   * 对线进行编号
   */
  this.setLinkNumber = function (group, type) {
    if (group.length == 0) return;
    //对该分组内的关系按照方向进行分类，此处根据连接的实体ASCII值大小分成两部分
    var linksA = [],
      linksB = [];
    for (var i = 0; i < group.length; i++) {
      var link = group[i];
      if (link.source < link.target) {
        linksA.push(link);
      } else {
        linksB.push(link);
      }
    }
    //确定关系最大编号。为了使得连接两个实体的关系曲线呈现对称，根据关系数量奇偶性进行平分。
    //特殊情况：当关系都是连接到同一个实体时，不平分
    var maxLinkNumber = 0;
    if (type == 'self') {
      maxLinkNumber = group.length;
    } else {
      maxLinkNumber = group.length % 2 == 0 ? group.length / 2 : (group.length + 1) / 2;
    }
    //如果两个方向的关系数量一样多，直接分别设置编号即可
    if (linksA.length == linksB.length) {
      var startLinkNumber = 1;
      for (var i = 0; i < linksA.length; i++) {
        linksA[i].linknum = startLinkNumber++;
      }
      startLinkNumber = 1;
      for (var i = 0; i < linksB.length; i++) {
        linksB[i].linknum = startLinkNumber++;
      }
    } else { //当两个方向的关系数量不对等时，先对数量少的那组关系从最大编号值进行逆序编号，然后在对另一组数量多的关系从编号1一直编号到最大编号，再对剩余关系进行负编号
      //如果抛开负号，可以发现，最终所有关系的编号序列一定是对称的（对称是为了保证后续绘图时曲线的弯曲程度也是对称的）
      var biggerLinks, smallerLinks;
      if (linksA.length > linksB.length) {
        biggerLinks = linksA;
        smallerLinks = linksB;
      } else {
        biggerLinks = linksB;
        smallerLinks = linksA;
      }

      var startLinkNumber = maxLinkNumber;
      for (var i = 0; i < smallerLinks.length; i++) {
        smallerLinks[i].linknum = startLinkNumber--;
      }
      var tmpNumber = startLinkNumber;

      startLinkNumber = 1;
      var p = 0;
      while (startLinkNumber <= maxLinkNumber) {
        biggerLinks[p++].linknum = startLinkNumber++;
      }
      //开始负编号
      startLinkNumber = 0 - tmpNumber;
      for (var i = p; i < biggerLinks.length; i++) {
        biggerLinks[i].linknum = startLinkNumber++;
      }
    }
  }
  /**
   * 添加关系线到图
   */
  this.appendRelationshipToGraph = function () {
    var relationship = this.appendRelationship(), // 添加关系
      text = this.appendTextToRelationship(relationship), // 添加关系文字
      outline = this.appendOutlineToRelationship(relationship); // 添加外部关系线
    // overlay = this.appendOverlayToRelationship(relationship); //添加关系覆盖

    return {
      outline: outline,
      // overlay: overlay,
      relationship: relationship,
      text: text
    };
  };
  /**
   * 添加关系覆盖
   *
   * @param {*}
   *            r
   */
  this.appendOverlayToRelationship = function (r) {
    return r
      .append("path")
      .attr("class", "overlay")
      .attr("user-select", "none");
  };
  /**
   * 添加外部关系线 如果是虚线 则显示为虚线
   *
   * @param {*}
   *            r
   */
  this.appendOutlineToRelationship = function (r) {
    var that = this;
    return r.append("path")
      .attr("class", "outline")
      .attr("fill", "none")
      .attr("stroke", function() {
        if(that.options.linkColor){
          return that.options.linkColor;
        }
        return "#c96feb";
      })
      .attr("stroke-width", function () {
        if(that.options.linkWidth){
          return that.options.linkWidth + "px";
        }
        return "2px";
      })
      .attr("marker-end", function (d) {
        return "url(#marker)";
      })
      .attr("id", function (d, i) {
        return "link" + i;
      });
    //    return r
    //      .append("path")
    //      .attr("class", "outline")
    //      .attr("data-lineType", function(d) {
    //        if (d.properties.realType === "0") {
    //          // 如果是虚线 则显示为0
    //          return 0;
    //        } else {
    //          return 1;
    //        }
    //      })
    //      .attr("stroke", function(d) {
    //        if (d.properties.realType === "0") {
    //          // 如果是虚线 则显示为虚线
    //          return "#A9A9A9";
    //        } else {
    //          return "#128EB9";
    //        }
    //      })
    //      .attr("stroke-dasharray", function(d) {
    //        if (d.properties.realType === "0") {
    //          // 如果是虚线 则显示为虚线
    //          return "5,5";
    //        }
    //      })
    //      .attr("stroke-linecap", function(d) {
    //        if (d.properties.realType === "0") {
    //          // 如果是虚线 则显示为虚线
    //          return "butt";
    //        }
    //      })
    //      .attr("stroke-width", "1");
  };
  /**
   * 添加关系文字
   *
   * @param {*}
   *            r
   */
  this.appendTextToRelationship = function (r) {
    var that = this;
    return r.append("text")
      .style("fill", function() {
        if(that.options.linkTextColor){
          return that.options.linkTextColor;
        }
        return "#c96feb";
      })
      .style("font-size", function() {
        if(that.options.linkTextSize){
          return that.options.linkTextSize + "vh";
        }
        return "1vh";
      })
      .attr('class', 'text')
      // .style("font-weight", "bold")
      .append("textPath")
      .attr(
        //引用路径
        "xlink:href",
        function (d, i) {
          return "#link" + i;
        }
      )
      .attr("startOffset", "45%") //设置开始位置百分比
      .text(function (d) {
        return d.type;
      });
    //    return r
    //      .append("text")
    //      .attr("class", "text")
    //      .attr("fill", "black")
    //      .attr("font-size", "8px")
    //      .attr("pointer-events", "none")
    //      .attr("text-anchor", "middle")
    //      .text(function(d) {
    //        return d.type;
    //      });
  };
  /**
   * 添加关系
   */
  this.appendRelationship = function () {
    var that = this;
    return this.relationship
      .enter()
      .append("g")
      .attr("class", "relationship")
      .on("dblclick", function (d) {
        // 双击事件
        if (typeof that.onRelationshipDoubleClick === "function") {
          // 双击关系方法
          that.onRelationshipDoubleClick(d);
        }
      })
      .on("click", function (d) {
        // 单击事件
        if (typeof that.onRelationshipClick === "function") {
          // 单击关系方法
          that.onRelationshipClick(d);
        }
      })
      .on("mouseenter", function (d) {
        // 鼠标hover方法
//        if (that.info) {
//          that.updateInfo(d);
//        }
      })
      .on("mouseleave", function (d) {
//        if (that.info) {
//          // 如果有选中的节点 则显示其节点的内容 ，反之 则清除内容
//          var relationship = that.relationship.filter(function (d) {
//            return d.selected === true;
//          });
//          if (relationship.data().length > 0) {
//            that.updateInfo(relationship.data()[0]);
//          } else {
//            that.clearInfo(d);
//          }
//        }
      });
  };
  /**
   * 关系线单击事件
   *
   * @param {*}
   *            d
   */
  this.onRelationshipClick = function (d) {
    var that = this;
    that.relationship.classed("multiSelected", false); // 清空多选class
    if (!d.selected) {
      that.relationship.classed("selected", function (p) {
        return (p.selected = d === p);
      });
    }
  };
  /**
   * 双击关系线事件
   *
   * @param {*}
   *            relationship
   */
  this.onRelationshipDoubleClick = function (relationship) {
    console.log(
      "double click on relationship: " + JSON.stringify(relationship)
    );
  };
  /**
   * 更新信息
   */
  /*this.updateInfo = function (d) {
	  spop("更新信息:" + d.labels);
  };*/
  /**
   * 添加信息元素
   *
   * @param {*}
   *            cls ：类名
   * @param {*}
   *            isNode ：是否节点
   * @param {*}
   *            property ：属性
   * @param {*}
   *            value ：值
   */
  this.appendInfoElement = function (cls, isNode, property, value) {
    var elem = this.info.append("a");
    var that = this;
    elem
      .attr("href", "javascript:void(0)")
      .style("text-decoration", "none")
      .attr("class", cls)
      .html("<strong>" + property + "</strong>" + (value ? ": " + value : ""))
      .on("click", function () {
        if (this.className == "class") spop(this.text);
      });
    if (!value) {
      elem
        .style("background-color", function (d) {
          return that.options.nodeOutlineFillColor ?
            that.options.nodeOutlineFillColor :
            isNode ?
            that.class2color(property) :
            that.defaultColor();
        })
        .style("border-color", function (d) {
          return that.options.nodeOutlineFillColor ?
            that.class2darkenColor(that.options.nodeOutlineFillColor) :
            isNode ?
            that.class2darkenColor(property) :
            that.defaultDarkenColor();
        })
        .style("color", function (d) {
          return that.options.nodeOutlineFillColor ?
            that.class2darkenColor(that.options.nodeOutlineFillColor) :
            "#fff";
        });
    }
  };
  /**
   * 通过class 转 颜色
   *
   * @param {*}
   *            cls
   */
  this.class2color = function (cls) {
    var color = this.classes2colors[cls]; // 获取配置颜色

    if (!color) {
      // 无配置颜色 返回默认颜色
      // color = options.colors[Math.min(numClasses, options.colors.length
      // - 1)];
      color = this.options.colors[this.numClasses % this.options.colors.length];
      this.classes2colors[cls] = color;
      this.numClasses++;
    }

    return color;
  };
  /**
   * 通过class 转颜色 ： 深色
   *
   * @param {*}
   *            cls
   */
  this.class2darkenColor = function (cls) {
    return d3.rgb(this.class2color(cls)).darker(1);
  };
  /**
   * 默认颜色
   */
  this.defaultColor = function () {
    return this.options.relationshipColor;
  };
  /**
   * 默认深色
   */
  this.defaultDarkenColor = function () {
    return d3
      .rgb(this.options.colors[this.options.colors.length - 1])
      .darker(1);
  };
  /**
   * 添加信息元素class
   *
   * @param {*}
   *            cls
   * @param {*}
   *            node
   */
  this.appendInfoElementClass = function (cls, node) {
    this.appendInfoElement(cls, true, node);
  };
  /**
   * 添加信息元素属性
   *
   * @param {*}
   *            cls
   * @param {*}
   *            property
   * @param {*}
   *            value
   */
  this.appendInfoElementProperty = function (cls, property, value) {
    this.appendInfoElement(cls, false, property, value);
  };
  /**
   * 添加关系信息元素
   *
   * @param {*}
   *            cls
   * @param {*}
   *            relationship
   */
  this.appendInfoElementRelationship = function (cls, relationship) {
    this.appendInfoElement(cls, false, relationship);
  };
  /**
   * 清空信息
   */
  this.clearInfo = function () {
    this.info.html("");
  };

  /**
   * 随机扩展数据
   *
   * @param {*}
   *            d
   * @param {*}
   *            maxNodesToGenerate
   */
  this.randomD3Data = function (d, maxNodesToGenerate) {
    var that = this;
    var data = {
        nodes: [],
        relationships: []
      },
      i,
      label,
      node,
      numNodes = ((maxNodesToGenerate * Math.random()) << 0) + 1,
      relationship,
      s = that.size();

    for (i = 0; i < numNodes; i++) {
      // label = that.randomLabel();
      label = "节点" + i;

      node = {
        id: s.nodes + 1 + i,
        labels: [label],
        properties: {
          random: label
        },
        x: d.x,
        y: d.y
      };

      data.nodes[data.nodes.length] = node;

      relationship = {
        id: s.relationships + 1 + i,
        type: label.toUpperCase(),
        startNode: d.id,
        endNode: s.nodes + 1 + i,
        properties: {
          from: Date.now(),
          name: "从属组织" + i,
          realType: "1",
          behaviorType: "1",
          actionType: "1",
          latelyTime: "",
          earliestTime: "",
          actionTime: ""
        },
        source: d.id,
        target: s.nodes + 1 + i,
        linknum: s.relationships + 1 + i
      };

      data.relationships[data.relationships.length] = relationship;
    }
    return data;
  };

  this.randomLabel = function () {
    var icons = Object.keys(this.options.iconMap);
    return icons[(icons.length * Math.random()) << 0];
  };
  this.size = function () {
    return {
      nodes: this.nodes.length,
      relationships: this.relationships.length
    };
  };
  /**
   * 更新neo4j数据
   *
   * @param {*}
   *            neo4jData
   * @param {*}
   *            updateNode（集合） //标记 添加标签和移除标签需要更新的属性 即id一样更新的节点
   */
  this.updateWithNeo4jData = function (neo4jData, updateNode) {
    var d3Data = this.neo4jDataToD3Data(neo4jData); // neo4j数据转换为d3数据
    // 处理数据
    this.updateWithD3Data(d3Data, null, null, updateNode); // 更新d3数据
  };

  /**
   * 双击节点是触发更新neo4j数据
   *
   * @param {*}
   *            neo4jData
   */
  this.updateWithNeo4jData_dubble = function (neo4jData) {
    var data = neo4jData.results[0].data[0].graph;
    this.extend_selection_node(data); // 扩展选择节点
  };
  // 扩展时取到所有点，让用户有指向的自主选择 选择完成后 图形只展示选择的节点
  this.extend_selection_node = function (data) {
    var that = this;
    // 取得双击的节点 用于删除双击节点时关闭弹窗
    that.double_click_obj = data.nodes[0];
    // 列表/关系列表展示统计方法
    popup_list(data, that, "accordion_doubble"); // 数据处理方法
  };
  /**
   * 更新(排重)节点/关系数据
   */
  this.row_weight_node = function (d3Data) {
    /**
     * 更新节点
     *
     * @param {*}
     *            n
     */
    var that = this;
    // forEach
    that.nodes.forEach(d => {
      // 排重
      d3Data.nodes.forEach(v => {
        if (v.id === d.id) {
          n.splice(n.indexOf(v), 1);
        }
      });
    });
    Array.prototype.push.apply(this.nodes, n);
    /**
     * 更新关系
     */
    that.relationships.forEach(d => {
      // 过滤已有关系线
      r.forEach(v => {
        if (v.id === d.id) {
          d3Data.relationships.splice(r.indexOf(v), 1);
        }
      });
    });
  };
  /**
   * 根据节点id 获取数据
   *
   * @param {*}
   *            node
   */
  this.getDataById = function (node) {
    var that = this; // 图对象
    if (node.data().length != 0) {
      // 加载知识图谱
      // 先后台获取当前用户可以查看的系统用户ids
      // 参数封装
      var params = {};
      params.id = node.data()[0].id;
      params.authorityIds = JSON.stringify(neo.authorityIds);
      // 使用后台调用ajax https协议
      $.ajax({
          type: "POST",
          url: basepath + "/graph/allNode",
          data: params,
          success: function (data) {
            if (data.message) {
              return false;
            }
            if (typeof data === "string") {
              data = JSON.parse(data);
            }
            // 处理文字和图像
            data.results[0].data[0].graph.nodes.forEach(function (element, index) {
              var text;
              element.img = neo.getText(element, "nodeImg");
              element.text = neo.getText(element, "nodeText");
            });
            that.updateWithNeo4jData(data);
          }
      });
  }
};
/**
 * 二维扩展
 */
this.getTwoDimensionalExpansion = function (node) { //true直接画图，false弹出列表
  var params = {};
  var that = this; // 图对象
  var url = "./graph/getGraphTwoDimensionNode";
  if (node.data().length != 0) {
    params.id = node.data()[0].id;
    params.authorityIds = neo.authorityIds;
    $.ajax({
      type: "POST",
      url: url,
      data: params,
      success: function (data) {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        if (data.twoDimensionCountMark != null && data.twoDimensionCountMark == true) { //返回true的时候直接上图
          //当twoDimensionCountMark==true的时候，先弹出列表，在进行选择节点画图
          //调用load_all_by_capital方法，渲染弹窗页面，然后进行节点选择，最后画图
          $.post("./graph/load_GraphTwoDimensionNode", {
              nodes: JSON.stringify(data.results[0].data[0].graph.nodes),
              authorityIds: JSON.stringify(neo.authorityIds),
              model: "TwoDimensionNode"
            },
            function (data2) {
              $("#accordion_listCp").html(data2);
              click_select("TwoDimensionNode");
            }
          );
          // 处理文字和图像
          data.results[0].data[0].graph.nodes.forEach(function (element, index) {
            element.img = neo.getText(element, "nodeImg");
            element.text = neo.getText(element, "nodeText");
          });
          updateGraphToItem(data); //画图
        } else if (data.twoDimensionCountMark == null || data.twoDimensionCountMark == false) { //返回false的时候先展示列表，然后根据选中的节点再画图
        	that.onTwoDimensionalClick(data.results[0].data[0].graph); //查询第二个接口返回的节点数据，包括节点和关系
        }
      }
    });
  }
}
//向二维扩展右侧列表填充数据
this.onTwoDimensionalClick = function (data) {
  var that = this;
  // 双击加入loading样式
  var html = '<div class="panel-group wrap" id="accordion_twoDimensional" role="tablist" aria-multiselectable="true" style="margin-top: 10px;overflow-y: auto;"></div>';
  $(".doubble").html(html);
  // 打开浮动框
  addTab("二维扩展", "accordion_twoDimensional");
  $("#accordion_twoDimensional").load(basepath + "/page/common/loading.html");
  // 取得双击的节点 用于删除双击节点时关闭弹窗
  that.double_click_obj = data.nodes[0];
  // 列表/关系列表展示统计方法
  popup_list(data, that, "accordion_twoDimensional"); // 数据处理方法
  $("#accordion_twoDimensional").css("height", $("#accordion_listParent").height() - 74 + "px");
};
/**
 * 根据属性名称name，以及label的类型，返回对应的文本或图片路径
 *
 * @param {*}
 *            name
 * @param {*}
 *            label
 */
this.getText = function (node, label) {
  var name;
  if (node.properties.name != null) {
    name = node.properties.name;
  } else {
    return false;
  }
  var path = ".";
  switch (label) {
    case "nodeText": // 关系图中节点的文字
        return node.properties.name;
      break;
    case "nodeImg": // 关系图中节点的图片路径
        return path + "/d3.v4/people.svg";
      break;
    case "relationText": // 关系图中关系线的文字
      break;
    case "relationType": // 关系图中关系线的虚实
      break;

    default:
      break;
  }
};
/**
 * 加载数据
 */
this.loadNeo4jData = function () {
  this.nodes = [];
  this.relationships = [];
  this.updateWithNeo4jData(this.options.neo4jData);
};
/**
 * 报告操作 初始化的时候为报告数据中添加并标记起点
 */
this.reportControl = function () {
  var that = this;
  if (param.isFullScreen == 1) {
    // 初始化的时候 要确定起点
    this.nodes.forEach(function (item, index) {
      if (item.properties.name === param.nameRid) {
        setStartData(param.reportData, item);
      }
    });
    // 添加其子项
    this.nodes.forEach(function (item, index) {
      if (item.properties.name != param.nameRid) {
        item.properties.pname = param.nameRid;
        // 添加其子项
        that.addReportNode(param.reportData.children, item, option);
      }
    });
  }
};
/**
 * 报告操作 通过父级pname 来增加子节点
 */
this.addReportNode = function (report, node, option) {
  // 添加其子项
  option.type = "add"; // 直接根据 父级 做添加操作
  option.father = false; // 没有父级
  option.nodeIn = true; // 使用 pname 属性做参照
  nodeoption(report, node, option);
};
/**
 * 通过url加载数据
 *
 * @param {*}
 *            neo4jDataUrl
 */
this.loadNeo4jDataFromUrl = function (model) {
  if (!model) {
    this.nodes = [];
    this.relationships = [];
  }
  var that = this;
  $("#accordion_list").load(basepath + "/page/common/loading.html"); // 载入加载页面
  //    $("#accordion_listCp").load(basepath + "/page/common/loading.html");
  if (that.options.mark) {
    // 初始化列表去掉时间
    //that.options.params.startTime =  getTimeSection("internet_information_reservation").stime + " 00:00:00";
    //that.options.params.stopTime =  getTimeSection("internet_information_reservation").etime + " 23:59:59";
    that.options.params.startTime = "2018-01-01 00:00:00";
    that.options.params.stopTime = "2019-04-16 23:59:59";
    var url = "./graph/graphInit";
    var params = {};
    params.authorityIds = [] || neo.authorityIds;
    $.post(
      url, {
        data: params
      },
      function (data) {
        if (data != null && data != "" && data != undefined) {
          if (
            data.errorInitMessage != undefined &&
            data.errorInitMessage != null &&
            data.errorInitMessage != "" &&
            data.errorInitMessage == "查询数据为空！" ||
            data.message === "Match data is empty!"
          ) {

          } else {
            if (typeof data === "string") {
              data = JSON.parse(data);
            }
            //显示列表data.errorInitMessage == "查询数据为空！"
            showList(data, "accordion_list");
            //showList(data, "accordion_listCp");
          }
        }
      }
    );
  } else {
    $.ajax({
      type: "POST",
      url: url,
      data: that.options.params,
      success: function (data) {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        // 画图
        that.updateWithNeo4jData(data);
        that.reportControl();
      }
    });
  }
};
/**
 * graph.js 使用到的 包含类
 * @param {*} propertyName 
 */
this.compare = function (propertyName) {
  return function (object1, object2) {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if (value2 < value1) {
      return 1;
    } else if (value2 > value1) {
      return -1;
    } else {
      return 0;
    }
  };
}
/**
 * 初始化图形
 *
 * @param {g}
 *            _selector :实例化的对象
 * @param {*}
 *            _options :配置
 */
this.init = function (_selector, _options) {
  var that = this;
  // this.initIconMap(); //初始化图标
  this.merge(this.options, _options); // 合并配置
  if (this.options.icons) {
    this.options.showIcons = true;
  }
  if (!this.options.minCollision) {
    this.options.minCollision = this.options.nodeRadius * 3;
  }
  // this.initImageMap(); //初始化图片
  this.selector = _selector; // 实例化对象
  this.container = d3.select(this.selector); // 实例化容器
  this.container.attr("class", "neo4jd3").html("");
  if (this.options.infoPanel) {
    this.info = this.appendInfoPanel(this.container);
  }
  this.appendGraph(this.container); // 添加图形
  this.simulation = this.initSimulation(); // 初始化布局
  if (this.options.neo4jData) {
    //this.loadNeo4jData(this.options.neo4jData); // 加载数据
    this.loadNeo4jData(); // 加载数据
  } else if (this.options.neo4jDataUrl || this.options.mark) {
    //this.loadNeo4jDataFromUrl(this.options.neo4jDataUrl); // 通过url
    this.loadNeo4jDataFromUrl(this.options.neo4jDataUrl);
    // 加载数据
  } else {
    //console.error('Error: both neo4jData and neo4jDataUrl are empty!');
  }
};
this.init(_selector, _options);
}