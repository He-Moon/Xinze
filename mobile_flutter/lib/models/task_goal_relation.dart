import 'package:json_annotation/json_annotation.dart';

part 'task_goal_relation.g.dart';

@JsonSerializable()
class TaskGoalRelation {
  final String id;
  @JsonKey(name: 'task_id')
  final String taskId;
  @JsonKey(name: 'goal_id')
  final String goalId;
  @JsonKey(name: 'alignment_score')
  final double alignmentScore;
  @JsonKey(name: 'user_confirmed')
  final bool userConfirmed;
  final String? reasoning;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  // 关联的目标信息
  final Goal? goal;

  const TaskGoalRelation({
    required this.id,
    required this.taskId,
    required this.goalId,
    required this.alignmentScore,
    required this.userConfirmed,
    this.reasoning,
    required this.createdAt,
    required this.updatedAt,
    this.goal,
  });

  factory TaskGoalRelation.fromJson(Map<String, dynamic> json) => 
      _$TaskGoalRelationFromJson(json);
  Map<String, dynamic> toJson() => _$TaskGoalRelationToJson(this);

  TaskGoalRelation copyWith({
    String? id,
    String? taskId,
    String? goalId,
    double? alignmentScore,
    bool? userConfirmed,
    String? reasoning,
    DateTime? createdAt,
    DateTime? updatedAt,
    Goal? goal,
  }) {
    return TaskGoalRelation(
      id: id ?? this.id,
      taskId: taskId ?? this.taskId,
      goalId: goalId ?? this.goalId,
      alignmentScore: alignmentScore ?? this.alignmentScore,
      userConfirmed: userConfirmed ?? this.userConfirmed,
      reasoning: reasoning ?? this.reasoning,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      goal: goal ?? this.goal,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is TaskGoalRelation && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'TaskGoalRelation(id: $id, taskId: $taskId, goalId: $goalId, alignmentScore: $alignmentScore)';
  }
}

// 前向声明，避免循环依赖
class Goal {
  final String id;
  final String title;
  final String? description;
  final String status;
  final int priority;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String userId;
  final String? category;
  final List<String>? keywords;

  const Goal({
    required this.id,
    required this.title,
    this.description,
    required this.status,
    required this.priority,
    required this.createdAt,
    required this.updatedAt,
    required this.userId,
    this.category,
    this.keywords,
  });
}


