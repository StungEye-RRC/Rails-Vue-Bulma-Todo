class CreateToDos < ActiveRecord::Migration[5.2]
  def change
    create_table :to_dos do |t|
      t.text :description
      t.boolean :done

      t.timestamps
    end
  end
end
