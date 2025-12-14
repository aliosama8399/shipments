<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number')->unique();
            
            // Sender information
            $table->string('sender_name');
            $table->string('sender_phone');
            $table->text('sender_address');
            
            // Receiver information
            $table->string('receiver_name');
            $table->string('receiver_phone');
            $table->text('receiver_address');
            
            // Status & assignment
            $table->string('status')->default('CREATED');
            $table->foreignId('assigned_driver_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->timestamp('estimated_delivery_time')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
