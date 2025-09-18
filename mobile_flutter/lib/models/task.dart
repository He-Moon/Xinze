import 'package:json_annotation/json_annotation.dart';
import 'task_goal_relation.dart';

part 'task.g.dart';

enum TaskStatus { pending, inProgress, completed }
enum TaskPriority { low, medium, high }
enum TaskFrequency { daily, weekly, monthly }

@JsonSerializable()
class Task {
  final String id;
  final String title;
  final String? description;
  final TaskStatus status;
  final TaskPriority priority;
  final String type;
  @JsonKey(name: 'due_date')
  final DateTime? dueDate;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;
  @JsonKey(name: 'user_id')
  final String userId;

  // 时间分析
  @JsonKey(name: 'estimated_duration')
  final String? estimatedDuration;
  @JsonKey(name: 'has_deadline')
  final bool? hasDeadline;
  @JsonKey(name: 'suggested_timeframe')
  final String? suggestedTimeframe;

  // 重复性分析
  @JsonKey(name: 'is_recurring')
  final bool? isRecurring;
  final TaskFrequency? frequency;

  // 任务-目标关联
  @JsonKey(name: 'task_goals')
  final List<TaskGoalRelation>? taskGoals;

  const Task({
    required this.id,
    required this.title,
    this.description,
    required this.status,
    required this.priority,
    required this.type,
    this.dueDate,
    required this.createdAt,
    required this.updatedAt,
    required this.userId,
    this.estimatedDuration,
    this.hasDeadline,
    this.suggestedTimeframe,
    this.isRecurring,
    this.frequency,
    this.taskGoals,
  });

  factory Task.fromJson(Map<String, dynamic> json) => _$TaskFromJson(json);
  Map<String, dynamic> toJson() => _$TaskToJson(this);

  Task copyWith({
    String? id,
    String? title,
    String? description,
    TaskStatus? status,
    TaskPriority? priority,
    String? type,
    DateTime? dueDate,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? userId,
    String? estimatedDuration,
    bool? hasDeadline,
    String? suggestedTimeframe,
    bool? isRecurring,
    TaskFrequency? frequency,
    List<TaskGoalRelation>? taskGoals,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      status: status ?? this.status,
      priority: priority ?? this.priority,
      type: type ?? this.type,
      dueDate: dueDate ?? this.dueDate,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      userId: userId ?? this.userId,
      estimatedDuration: estimatedDuration ?? this.estimatedDuration,
      hasDeadline: hasDeadline ?? this.hasDeadline,
      suggestedTimeframe: suggestedTimeframe ?? this.suggestedTimeframe,
      isRecurring: isRecurring ?? this.isRecurring,
      frequency: frequency ?? this.frequency,
      taskGoals: taskGoals ?? this.taskGoals,
    );
  }

  // 便捷方法
  bool get isCompleted => status == TaskStatus.completed;
  bool get isPending => status == TaskStatus.pending;
  bool get isInProgress => status == TaskStatus.inProgress;

  String get statusText {
    switch (status) {
      case TaskStatus.pending:
        return '待完成';
      case TaskStatus.inProgress:
        return '进行中';
      case TaskStatus.completed:
        return '已完成';
    }
  }

  String get priorityText {
    switch (priority) {
      case TaskPriority.low:
        return '低';
      case TaskPriority.medium:
        return '中';
      case TaskPriority.high:
        return '高';
    }
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Task && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'Task(id: $id, title: $title, status: $status, priority: $priority)';
  }
}
